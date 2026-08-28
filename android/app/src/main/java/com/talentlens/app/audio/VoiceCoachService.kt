package com.talentlens.app.audio

import android.content.Context
import android.media.AudioManager
import android.media.ToneGenerator
import android.speech.tts.TextToSpeech
import java.util.Locale

class VoiceCoachService(context: Context) {

    private var tts: TextToSpeech? = null
    private var isTtsReady = false
    private var isMuted = false
    private var toneGenerator: ToneGenerator? = null

    init {
        try {
            toneGenerator = ToneGenerator(AudioManager.STREAM_MUSIC, 85)
        } catch (e: Exception) {
            // Ignore
        }

        tts = TextToSpeech(context.applicationContext) { status ->
            if (status == TextToSpeech.SUCCESS) {
                tts?.let {
                    it.language = Locale.ENGLISH
                    it.setSpeechRate(1.1f)
                    it.setPitch(1.05f)
                    isTtsReady = true
                }
            }
        }
    }

    fun setMuted(muted: Boolean) {
        isMuted = muted
    }

    fun isMuted(): Boolean = isMuted

    fun speak(text: String, priority: Boolean = false) {
        if (isMuted || !isTtsReady) return
        val queueMode = if (priority) TextToSpeech.QUEUE_FLUSH else TextToSpeech.QUEUE_ADD
        tts?.speak(text, queueMode, null, "talentlens_coach")
    }

    fun playDepthBeep() {
        try {
            toneGenerator?.startTone(ToneGenerator.TONE_PROP_BEEP, 70)
        } catch (e: Exception) {
            // Ignore
        }
    }

    fun playRepCountBeep() {
        try {
            toneGenerator?.startTone(ToneGenerator.TONE_PROP_ACK, 100)
        } catch (e: Exception) {
            // Ignore
        }
    }

    fun playWarningBeep() {
        try {
            toneGenerator?.startTone(ToneGenerator.TONE_PROP_NACK, 120)
        } catch (e: Exception) {
            // Ignore
        }
    }

    fun shutdown() {
        tts?.stop()
        tts?.shutdown()
        toneGenerator?.release()
    }
}
