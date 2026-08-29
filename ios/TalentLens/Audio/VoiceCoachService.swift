//
//  VoiceCoachService.swift
//  TalentLens
//
//  Created for TalentLens Olympic-Grade Athletic Testing Suite.
//

import Foundation
import AVFoundation
import AudioToolbox

@MainActor
public class VoiceCoachService: NSObject, ObservableObject, AVSpeechSynthesizerDelegate {
    public static let shared = VoiceCoachService()
    
    private let synthesizer = AVSpeechSynthesizer()
    @Published public var isMuted: Bool = false
    
    public override init() {
        super.init()
        synthesizer.delegate = self
        configureAudioSession()
    }
    
    private func configureAudioSession() {
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback, mode: .voicePrompt, options: [.duckOthers])
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            print("Failed to configure audio session: \(error)")
        }
    }
    
    public func speak(_ text: String, priority: Bool = false) {
        guard !isMuted else { return }
        
        if priority && synthesizer.isSpeaking {
            synthesizer.stopSpeaking(at: .immediate)
        }
        
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = AVSpeechSynthesisVoice(language: "en-US") ?? AVSpeechSynthesisVoice(language: "en-GB")
        utterance.rate = 0.54
        utterance.pitchMultiplier = 1.05
        utterance.volume = 1.0
        
        synthesizer.speak(utterance)
    }
    
    public func playDepthBeep() {
        guard !isMuted else { return }
        AudioServicesPlaySystemSound(1057) // Camera shutter / subtle tick
    }
    
    public func playRepCountBeep() {
        guard !isMuted else { return }
        AudioServicesPlaySystemSound(1103) // Positive chime sound
    }
    
    public func playWarningBeep() {
        guard !isMuted else { return }
        AudioServicesPlaySystemSound(1053) // Alert tone
    }
    
    public func shutdown() {
        synthesizer.stopSpeaking(at: .immediate)
    }
}
