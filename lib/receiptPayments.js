function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

const CASH_META_PREFIX = "cash_meta:";

export function encodeCashPaymentMeta({ cashReceived, changeGiven }) {
  const received = round2(cashReceived);
  const change = round2(changeGiven);

  if (!Number.isFinite(received) || received <= 0) {
    return null;
  }

  return `${CASH_META_PREFIX}${JSON.stringify({
    cashReceived: received,
    changeGiven: Number.isFinite(change) && change > 0 ? change : 0,
  })}`;
}

export function decodeCashPaymentMeta(providerRef) {
  const value = String(providerRef || "");
  if (!value.startsWith(CASH_META_PREFIX)) {
    return null;
  }

  try {
    const parsed = JSON.parse(value.slice(CASH_META_PREFIX.length));
    const cashReceived = round2(parsed?.cashReceived);
    const changeGiven = round2(parsed?.changeGiven);

    if (!Number.isFinite(cashReceived) || cashReceived <= 0) {
      return null;
    }

    return {
      cashReceived,
      changeGiven: Number.isFinite(changeGiven) && changeGiven > 0 ? changeGiven : 0,
    };
  } catch {
    return null;
  }
}
