export type BinaryChoice = "phish" | "legit" | null;
export type BrowserChoice = "back" | "proceed" | "report";

export function scoreBinary({
  isPhish,
  choice,
}: {
  isPhish: boolean;
  choice: BinaryChoice;
}): 0 | 1 {
  if (choice === null) return 0;
  if (isPhish && choice === "phish") return 1;
  if (!isPhish && choice === "legit") return 1;
  return 0;
}

export function scoreBrowser({
  isPhish,
  choice,
}: {
  isPhish: boolean;
  choice: BrowserChoice;
}): number {
  if (isPhish) {
    if (choice === "report") return 1.1;
    if (choice === "back") return 1;
    return 0;
  }
  return choice === "proceed" ? 1 : 0;
}

export function scoreInboxF1({
  phishIds,
  selectedIds,
}: {
  phishIds: number[];
  selectedIds: number[];
}): number {
  if (phishIds.length === 0 && selectedIds.length === 0) return 1;
  const phishSet = new Set(phishIds);
  const selSet = new Set(selectedIds);
  const tp = [...selSet].filter((id) => phishSet.has(id)).length;
  const fp = selSet.size - tp;
  const fn = phishSet.size - tp;
  if (tp === 0) return 0;
  const precision = tp / (tp + fp);
  const recall = tp / (tp + fn);
  return (2 * precision * recall) / (precision + recall);
}

export function scoreQuestion(
  input:
    | { type: "email" | "sms" | "qr"; isPhish: boolean; choice: BinaryChoice }
    | { type: "browser"; isPhish: boolean; choice: BrowserChoice }
    | { type: "inbox_batch"; phishIds: number[]; selectedIds: number[] },
): number {
  if (input.type === "browser") return scoreBrowser(input);
  if (input.type === "inbox_batch") return scoreInboxF1(input);
  return scoreBinary(input);
}
