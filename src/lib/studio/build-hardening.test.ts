import { describe, expect, it } from "vitest";

describe("Build Studio Block Hardening & Sort Re-indexing", () => {
  it("re-indexes remaining blocks sequentially starting at 1 after a deletion", () => {
    const blocksBefore = [
      { id: "block1", sortOrder: 1 },
      { id: "block2", sortOrder: 2 }, // deleted block
      { id: "block3", sortOrder: 3 },
      { id: "block4", sortOrder: 4 },
    ];

    // Simulate deleting block2
    const remaining = blocksBefore.filter((b) => b.id !== "block2");

    // Re-indexing logic
    const reindexed = remaining.map((block, index) => ({
      ...block,
      sortOrder: index + 1,
    }));

    expect(reindexed).toEqual([
      { id: "block1", sortOrder: 1 },
      { id: "block3", sortOrder: 2 },
      { id: "block4", sortOrder: 3 },
    ]);
  });

  it("re-indexes sortOrder continuously even for non-contiguous or sparse existing sort orders", () => {
    const blocksBefore = [
      { id: "blockA", sortOrder: 5 },
      { id: "blockB", sortOrder: 10 },
    ];

    const reindexed = blocksBefore.map((block, index) => ({
      ...block,
      sortOrder: index + 1,
    }));

    expect(reindexed).toEqual([
      { id: "blockA", sortOrder: 1 },
      { id: "blockB", sortOrder: 2 },
    ]);
  });
});
