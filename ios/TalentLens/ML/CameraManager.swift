//
//  CameraManager.swift
//  TalentLens
//
//  Created for TalentLens Olympic-Grade Athletic Testing Suite.
//

import Foundation
import AVFoundation
import SwiftUI
import Vision

public class CameraManager: NSObject, ObservableObject, AVCaptureVideoDataOutputSampleBufferDelegate {
    @Published public var isCameraAuthorized: Bool = false
    @Published public var isFrontCamera: Bool = true
    @Published public var detectedLandmarks: [Point2D] = []
    
    public let captureSession = AVCaptureSession()
    private let videoOutput = AVCaptureVideoDataOutput()
    private let sessionQueue = DispatchQueue(label: "com.talentlens.cameraQueue")
    
    public var onLandmarksDetected: (([Point2D]) -> Void)?
    
    public override init() {
        super.init()
        checkPermissions()
    }
    
    public func checkPermissions() {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            self.isCameraAuthorized = true
            setupSession()
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .video) { [weak self] granted in
                DispatchQueue.main.async {
                    self?.isCameraAuthorized = granted
                    if granted {
                        self?.setupSession()
                    }
                }
            }
        default:
            self.isCameraAuthorized = false
        }
    }
    
    public func setupSession() {
        sessionQueue.async { [weak self] in
            guard let self = self else { return }
            self.captureSession.beginConfiguration()
            self.captureSession.sessionPreset = .high
            
            // Remove existing inputs
            for input in self.captureSession.inputs {
                self.captureSession.removeInput(input)
            }
            
            let position: AVCaptureDevice.Position = self.isFrontCamera ? .front : .back
            guard let device = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: position),
                  let input = try? AVCaptureDeviceInput(device: device) else {
                self.captureSession.commitConfiguration()
                return
            }
            
            if self.captureSession.canAddInput(input) {
                self.captureSession.addInput(input)
            }
            
            if !self.captureSession.outputs.contains(self.videoOutput) {
                self.videoOutput.setSampleBufferDelegate(self, queue: self.sessionQueue)
                self.videoOutput.alwaysDiscardsLateVideoFrames = true
                self.videoOutput.videoSettings = [
                    (kCVPixelBufferPixelFormatTypeKey as String): Int(kCVPixelFormatType_420YpCbCr8BiPlanarFullRange)
                ]
                if self.captureSession.canAddOutput(self.videoOutput) {
                    self.captureSession.addOutput(self.videoOutput)
                }
            }
            
            // Fix video orientation if supported
            if let connection = self.videoOutput.connection(with: .video) {
                if connection.isVideoMirroringSupported {
                    connection.isVideoMirrored = self.isFrontCamera
                }
            }
            
            self.captureSession.commitConfiguration()
            self.captureSession.startRunning()
        }
    }
    
    public func flipCamera() {
        isFrontCamera.toggle()
        setupSession()
    }
    
    public func startSession() {
        sessionQueue.async { [weak self] in
            guard let self = self else { return }
            if !self.captureSession.isRunning {
                self.captureSession.startRunning()
            }
        }
    }
    
    public func stopSession() {
        sessionQueue.async { [weak self] in
            guard let self = self else { return }
            if self.captureSession.isRunning {
                self.captureSession.stopRunning()
            }
        }
    }
    
    // MARK: - AVCaptureVideoDataOutputSampleBufferDelegate
    public func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
        guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
        
        let request = VNDetectHumanBodyPoseRequest { [weak self] (req, err) in
            guard let self = self,
                  let observations = req.results as? [VNHumanBodyPoseObservation],
                  let observation = observations.first else {
                return
            }
            
            let landmarks = self.extractLandmarks(from: observation)
            DispatchQueue.main.async {
                self.detectedLandmarks = landmarks
                self.onLandmarksDetected?(landmarks)
            }
        }
        
        let handler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer, orientation: .up, options: [:])
        try? handler.perform([request])
    }
    
    private func extractLandmarks(from observation: VNHumanBodyPoseObservation) -> [Point2D] {
        var landmarks = Array(repeating: Point2D(x: 0.5, y: 0.5, visibility: 0.0), count: 33)
        
        let mapping: [(VNHumanBodyPoseObservation.JointName, Int)] = [
            (.nose, 0),
            (.leftEye, 2),
            (.rightEye, 5),
            (.leftEar, 7),
            (.rightEar, 8),
            (.leftShoulder, 11),
            (.rightShoulder, 12),
            (.leftElbow, 13),
            (.rightElbow, 14),
            (.leftWrist, 15),
            (.rightWrist, 16),
            (.leftHip, 23),
            (.rightHip, 24),
            (.leftKnee, 25),
            (.rightKnee, 26),
            (.leftAnkle, 27),
            (.rightAnkle, 28)
        ]
        
        for (jointName, index) in mapping {
            if let point = try? observation.recognizedPoint(jointName), point.confidence > 0.2 {
                // Vision normalized coordinates have (0,0) at bottom-left, invert Y for standard screen coordinates
                landmarks[index] = Point2D(x: point.location.x, y: 1.0 - point.location.y, visibility: CGFloat(point.confidence))
            }
        }
        
        return landmarks
    }
}

public struct CameraPreviewView: UIViewRepresentable {
    public let captureSession: AVCaptureSession
    
    public init(captureSession: AVCaptureSession) {
        self.captureSession = captureSession
    }
    
    public func makeUIView(context: Context) -> UIView {
        let view = UIView(frame: .zero)
        let previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
        previewLayer.videoGravity = .resizeAspectFill
        view.layer.addSublayer(previewLayer)
        context.coordinator.previewLayer = previewLayer
        return view
    }
    
    public func updateUIView(_ uiView: UIView, context: Context) {
        DispatchQueue.main.async {
            context.coordinator.previewLayer?.frame = uiView.bounds
        }
    }
    
    public func makeCoordinator() -> Coordinator {
        Coordinator()
    }
    
    public class Coordinator {
        var previewLayer: AVCaptureVideoPreviewLayer?
    }
}
