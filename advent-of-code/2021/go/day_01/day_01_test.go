package day1

import (
	"io/ioutil"
	"log"
	"path/filepath"
	"testing"
)

var actualInput = parseInput(readInputFile("day_01.txt"))
var sampleInput = parseInput(`199
200
208
210
200
207
240
269
260
263`)

func TestPart1(t *testing.T) {
	got := part1(sampleInput)
	want := 7
	if got != want {
		t.Errorf("wrong result for sample input. got: %d, want: %d", got, want)
	}

	got = part1(actualInput)
	want = 1162
	if got != want {
		t.Errorf("wrong result for actual input. got: %d, want: %d", got, want)
	}
}

func TestPart2(t *testing.T) {
	got := part2(sampleInput)
	want := 5
	if got != want {
		t.Errorf("wrong result for sample input. got: %d, want: %d", got, want)
	}

	got = part2(actualInput)
	want = 1190
	if got != want {
		t.Errorf("wrong result for actual input. got: %d, want: %d", got, want)
	}
}

func readInputFile(name string) string {
	byt, err := ioutil.ReadFile(filepath.Join("../../inputs/", name))
	if err != nil {
		log.Fatal(err)
	}
	return string(byt)
}
