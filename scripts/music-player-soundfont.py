#!/usr/bin/env python3
# Copyright 2026 The Pennsylvania State University
# @license Apache-2.0, see LICENSE for full text.
"""
Build the soundfont music-player ships in elements/music-player/lib/soundfont.

music-player plays MIDI through html-midi-player (magenta SoundFontPlayer),
which reads a folder of per-note mp3 files described by soundfont.json and
one instrument.json per instrument. The soundfont is served from the element's
own folder so playing music contacts no third party.

Source: FluidR3_GM.sf2 by Frank Wen, MIT license (Debian/Ubuntu package
fluid-soundfont-gm). One instrument is rendered per General MIDI family, plus
the standard drum kit; soundfont.json points every program in a family at its
family's instrument. That keeps the shipped size small while every MIDI file
still plays with a fitting sound.

Requirements: fluidsynth, ffmpeg, python mido (pip install mido).
Usage: python3 scripts/music-player-soundfont.py [path/to/FluidR3_GM.sf2]
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile

import mido

SF2 = sys.argv[1] if len(sys.argv) > 1 else "/usr/share/sounds/sf2/FluidR3_GM.sf2"
OUT = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "..",
    "elements",
    "music-player",
    "lib",
    "soundfont",
)
RATE = 44100
# seconds a note is held, then how long its release rings out
HOLD = 2.0
RELEASE = 0.5
VELOCITY = 100
# General MIDI families (8 programs each) and the program rendered for each.
# Families without a fitting sound of their own share a neighbour's.
FAMILIES = [
    (0, "piano"),  # 0-7 pianos
    (11, "chromatic_percussion"),  # 8-15 vibraphone
    (16, "organ"),  # 16-23 drawbar organ
    (24, "guitar"),  # 24-31 nylon guitar
    (33, "bass"),  # 32-39 finger bass
    (40, "strings"),  # 40-47 violin
    (48, "ensemble"),  # 48-55 string ensemble
    (56, "brass"),  # 56-63 trumpet
    (65, "reed"),  # 64-71 alto sax
    (73, "pipe"),  # 72-79 flute
    (80, "synth_lead"),  # 80-87 square lead
    (89, "synth_pad"),  # 88-95 warm pad
    (None, "synth_pad"),  # 96-103 synth effects
    (104, "ethnic"),  # 104-111 sitar
    (114, "percussive"),  # 112-119 steel drums
    (None, "piano"),  # 120-127 sound effects
]
MELODIC_RANGE = (21, 108)
DRUM_RANGE = (27, 87)


def render(program, pitches, drums, workdir):
    """Render every pitch, one after another, into a single wav."""
    mid = mido.MidiFile(ticks_per_beat=480)
    track = mido.MidiTrack()
    mid.tracks.append(track)
    # 120 bpm: 960 ticks a second
    tps = 960
    channel = 9 if drums else 0
    track.append(mido.MetaMessage("set_tempo", tempo=500000, time=0))
    if not drums:
        track.append(mido.Message("program_change", program=program, channel=0))
    gap = int((HOLD + RELEASE) * tps)
    hold = int(HOLD * tps)
    for pitch in pitches:
        track.append(
            mido.Message(
                "note_on", note=pitch, velocity=VELOCITY, channel=channel, time=0
            )
        )
        track.append(
            mido.Message("note_off", note=pitch, velocity=0, channel=channel, time=hold)
        )
        track.append(mido.MetaMessage("marker", text="gap", time=gap - hold))
    midi_path = os.path.join(workdir, "notes.mid")
    wav_path = os.path.join(workdir, "notes.wav")
    mid.save(midi_path)
    subprocess.run(
        [
            "fluidsynth",
            "-ni",
            "-g",
            "2.0",
            "-R",
            "0",
            "-C",
            "0",
            "-r",
            str(RATE),
            "-F",
            wav_path,
            SF2,
            midi_path,
        ],
        check=True,
        stdout=subprocess.DEVNULL,
    )
    return wav_path


def split(wav_path, pitches, folder):
    span = HOLD + RELEASE
    for i, pitch in enumerate(pitches):
        subprocess.run(
            [
                "ffmpeg",
                "-v",
                "error",
                "-y",
                "-ss",
                str(i * span),
                "-t",
                str(span),
                "-i",
                wav_path,
                "-ac",
                "1",
                "-ar",
                "32000",
                "-af",
                "alimiter=limit=0.9:level=false,afade=t=out:st=%s:d=0.05" % (span - 0.05),
                "-codec:a",
                "libmp3lame",
                "-b:a",
                "48k",
                os.path.join(folder, "p%d.mp3" % pitch),
            ],
            check=True,
        )


def build(name, program, drums):
    low, high = DRUM_RANGE if drums else MELODIC_RANGE
    pitches = list(range(low, high + 1))
    folder = os.path.join(OUT, name)
    os.makedirs(folder, exist_ok=True)
    with tempfile.TemporaryDirectory() as workdir:
        split(render(program, pitches, drums, workdir), pitches, folder)
    with open(os.path.join(folder, "instrument.json"), "w") as f:
        json.dump(
            {
                "name": name,
                "minPitch": low,
                "maxPitch": high,
                "durationSeconds": HOLD,
                "releaseSeconds": RELEASE,
                "percussive": drums,
            },
            f,
            indent=2,
        )
        f.write("\n")


def main():
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(OUT)
    instruments = {}
    built = set()
    for family, (program, name) in enumerate(FAMILIES):
        if program is not None and name not in built:
            build(name, program, False)
            built.add(name)
        for p in range(family * 8, family * 8 + 8):
            instruments[str(p)] = name
    build("drums", 0, True)
    instruments["drums"] = "drums"
    with open(os.path.join(OUT, "soundfont.json"), "w") as f:
        json.dump({"name": "fluidr3_gm_families", "instruments": instruments}, f, indent=2)
        f.write("\n")


if __name__ == "__main__":
    main()
