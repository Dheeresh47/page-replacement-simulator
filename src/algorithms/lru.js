/**
 * LRU (Least Recently Used) Page Replacement Algorithm
 * Time Complexity: O(n * f) — for each page, scan usage history
 * Space Complexity: O(f) — f = number of frames
 *
 * Evicts the page that hasn't been used for the longest time.
 */

/**
 * @param {number[]} pages - Reference string array
 * @param {number} numFrames - Number of available frames
 * @returns {Object[]} steps - Array of step objects for animation
 */
export function runLRU(pages, numFrames) {
  const steps = [];
  let frames = new Array(numFrames).fill(null);
  // recency[i] = last step index at which frames[i] was used (lower = older)
  let recency = new Array(numFrames).fill(-1);
  let hits = 0;
  let faults = 0;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];

    // Check for HIT
    const hitIndex = frames.indexOf(page);
    if (hitIndex !== -1) {
      hits++;
      recency[hitIndex] = i; // Update recency on hit
      steps.push({
        stepIndex: i,
        page,
        frames: [...frames],
        fault: false,
        hitFrameIndex: hitIndex,
        replacedIndex: -1,
        faultCount: faults,
        hitCount: hits,
      });
    } else {
      // PAGE FAULT
      faults++;
      let replacedIndex;

      // Find an empty frame first
      const emptySlot = frames.indexOf(null);
      if (emptySlot !== -1) {
        replacedIndex = emptySlot;
      } else {
        // Evict the least recently used frame (lowest recency value)
        let minRecency = Infinity;
        replacedIndex = 0;
        for (let j = 0; j < numFrames; j++) {
          if (recency[j] < minRecency) {
            minRecency = recency[j];
            replacedIndex = j;
          }
        }
      }

      frames[replacedIndex] = page;
      recency[replacedIndex] = i;

      steps.push({
        stepIndex: i,
        page,
        frames: [...frames],
        fault: true,
        hitFrameIndex: -1,
        replacedIndex,
        faultCount: faults,
        hitCount: hits,
      });
    }
  }

  return steps;
}
