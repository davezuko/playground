package day1

import (
	"log"
	"strconv"
	"strings"
)

func part1(input []int) int {
	i := 1
	result := 0
	for i < len(input) {
		if input[i] > input[i-1] {
			result += 1
		}
		i += 1
	}
	return result
}

func part2(input []int) int {
	window := func(i int) int {
		sum := 0
		j := i
		for j <= i+2 {
			sum += input[j]
			j += 1
		}
		return sum
	}

	i := 0
	result := 0
	for i < len(input)-3 {
		if window(i) < window(i+1) {
			result += 1
		}
		i += 1
	}
	return result
}

func parseInput(input string) []int {
	lines := strings.Split(input, "\n")
	result := make([]int, len(lines))
	for i := range lines {
		n, err := strconv.Atoi(lines[i])
		if err != nil {
			log.Fatalln(err)
		}
		result[i] = n
	}
	return result
}
