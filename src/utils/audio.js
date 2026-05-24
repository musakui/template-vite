export function playAudio() {
	try {
		const audio = new AudioContext()
		const gain = audio.createGain()
		const osc = audio.createOscillator()
		gain.connect(audio.destination)
		gain.gain.setValueAtTime(0.3, audio.currentTime)
		gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.8)
		osc.frequency.value = 880
		osc.connect(gain)
		osc.start()
		osc.stop(audio.currentTime + 0.8)
	} catch {
		//
	}
}
