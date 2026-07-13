import { describe, expect, it } from "vitest";
import { parseClientMessage, parseServerMessage } from "./index";

describe("parseClientMessage", () => {
  it("accepts well-formed messages", () => {
    expect(parseClientMessage({ t: "move", payload: { cell: 4 } })).toEqual({
      t: "move",
      payload: { cell: 4 },
    });
    expect(parseClientMessage({ t: "start" })).toEqual({ t: "start" });
    expect(parseClientMessage({ t: "rematch" })).toEqual({ t: "rematch" });
    expect(parseClientMessage({ t: "leave" })).toEqual({ t: "leave" });
  });

  it("keeps arbitrary JSON as the move payload", () => {
    expect(parseClientMessage({ t: "move", payload: null })).toEqual({
      t: "move",
      payload: null,
    });
    expect(parseClientMessage({ t: "move", payload: [1, 2] })).toEqual({
      t: "move",
      payload: [1, 2],
    });
  });

  it("rejects non-objects and unknown tags", () => {
    expect(parseClientMessage(null)).toBeNull();
    expect(parseClientMessage(undefined)).toBeNull();
    expect(parseClientMessage("move")).toBeNull();
    expect(parseClientMessage(42)).toBeNull();
    expect(parseClientMessage([])).toBeNull();
    expect(parseClientMessage({})).toBeNull();
    expect(parseClientMessage({ t: "join", name: "x" })).toBeNull();
    expect(parseClientMessage({ t: "MOVE", payload: 1 })).toBeNull();
  });

  it("rejects a move without a payload field", () => {
    expect(parseClientMessage({ t: "move" })).toBeNull();
  });

  it("drops unknown extra fields", () => {
    expect(parseClientMessage({ t: "rematch", sneaky: true })).toEqual({
      t: "rematch",
    });
    expect(parseClientMessage({ t: "move", payload: 1, extra: "no" })).toEqual({
      t: "move",
      payload: 1,
    });
    expect(parseClientMessage({ t: "start", extra: "no" })).toEqual({
      t: "start",
    });
  });
});

describe("parseServerMessage", () => {
  it("accepts well-formed messages", () => {
    expect(
      parseServerMessage({
        t: "waiting",
        code: "AB2Z",
        names: ["Ayşe"],
        you: 0,
      }),
    ).toEqual({
      t: "waiting",
      code: "AB2Z",
      names: ["Ayşe"],
      you: 0,
    });
    expect(
      parseServerMessage({
        t: "start",
        seed: 123,
        names: ["Ayşe", "Mehmet"],
        you: 1,
      }),
    ).toEqual({ t: "start", seed: 123, names: ["Ayşe", "Mehmet"], you: 1 });
    expect(
      parseServerMessage({ t: "peer-move", payload: { r: 0 }, from: 1 }),
    ).toEqual({
      t: "peer-move",
      payload: { r: 0 },
      from: 1,
    });
    expect(parseServerMessage({ t: "rematch-start", seed: 9 })).toEqual({
      t: "rematch-start",
      seed: 9,
    });
    expect(parseServerMessage({ t: "peer-left" })).toEqual({ t: "peer-left" });
    expect(parseServerMessage({ t: "error", reason: "full" })).toEqual({
      t: "error",
      reason: "full",
    });
  });

  it("rejects non-objects and unknown tags", () => {
    expect(parseServerMessage(null)).toBeNull();
    expect(parseServerMessage("start")).toBeNull();
    expect(parseServerMessage([])).toBeNull();
    expect(parseServerMessage({ t: "restart" })).toBeNull();
  });

  it("rejects ill-typed start fields", () => {
    const valid = { t: "start", seed: 1, names: ["a", "b"], you: 0 };
    expect(parseServerMessage(valid)).not.toBeNull();
    expect(parseServerMessage({ ...valid, seed: "1" })).toBeNull();
    expect(parseServerMessage({ ...valid, seed: Number.NaN })).toBeNull();
    expect(parseServerMessage({ ...valid, names: ["a"] })).toBeNull();
    expect(
      parseServerMessage({ ...valid, names: Array(12).fill("a") }),
    ).toBeNull();
    expect(parseServerMessage({ ...valid, names: ["a", 2] })).toBeNull();
    expect(parseServerMessage({ ...valid, names: "ab" })).toBeNull();
    expect(parseServerMessage({ ...valid, you: 11 })).toBeNull();
    expect(parseServerMessage({ ...valid, you: "0" })).toBeNull();
  });

  it("rejects other ill-typed fields", () => {
    expect(parseServerMessage({ t: "waiting", code: 1234 })).toBeNull();
    expect(parseServerMessage({ t: "waiting" })).toBeNull();
    expect(parseServerMessage({ t: "peer-move" })).toBeNull();
    expect(parseServerMessage({ t: "rematch-start", seed: "9" })).toBeNull();
    expect(parseServerMessage({ t: "error", reason: "banned" })).toBeNull();
    expect(parseServerMessage({ t: "error" })).toBeNull();
  });

  it("drops unknown extra fields", () => {
    expect(parseServerMessage({ t: "peer-left", ghost: 1 })).toEqual({
      t: "peer-left",
    });
    expect(
      parseServerMessage({
        t: "start",
        seed: 5,
        names: ["a", "b"],
        you: 0,
        injected: "nope",
      }),
    ).toEqual({ t: "start", seed: 5, names: ["a", "b"], you: 0 });
  });
});
