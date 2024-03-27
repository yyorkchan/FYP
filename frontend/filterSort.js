export const filterTransactionAmount = (
  transactions,
  filterAmountType,
  filterAmountValue,
  filterAmountMin,
  filterAmountMax,
) => {
  if (
    filterAmountType == null ||
    (filterAmountType !== "between" && filterAmountValue == null) ||
    (filterAmountType === "between" &&
      (filterAmountMin == null || filterAmountMax == null))
  )
    return transactions;
  else if (filterAmountType === "=") {
    return transactions.filter(
      (transaction) => transaction.amount == filterAmountValue,
    );
  } else if (filterAmountType === "<") {
    return transactions.filter(
      (transaction) => transaction.amount < filterAmountValue,
    );
  } else if (filterAmountType === ">") {
    return transactions.filter(
      (transaction) => transaction.amount > filterAmountValue,
    );
  } else if (filterAmountType === "between") {
    return transactions.filter(
      (transaction) =>
        transaction.amount >= filterAmountMin &&
        transaction.amount <= filterAmountMax,
    );
  }
};

export const filterTransactionTime = (
  transactions,
  filterStartTime,
  filterEndTime,
) => {
  if (filterStartTime == null && filterEndTime == null) return transactions;
  else if (filterStartTime == null) {
    return transactions.filter(
      (transaction) => new Date(transaction.time) <= filterEndTime,
    );
  } else if (filterEndTime == null) {
    return transactions.filter(
      (transaction) => new Date(transaction.time) >= filterStartTime,
    );
  } else {
    return transactions.filter(
      (transaction) =>
        new Date(transaction.time) >= filterStartTime &&
        new Date(transaction.time) <= filterEndTime,
    );
  }
};

export const filterTransactionCategory = (transactions, filterCategory) => {
  if (
    filterCategory == null ||
    filterCategory == "All" ||
    filterCategory == "Total Balance"
  )
    return transactions;
  return transactions.filter(
    (transaction) => transaction.category === filterCategory,
  );
};

export const filterTransactionName = (transactions, filterName) => {
  if (filterName == null) return transactions;
  return transactions.filter((transaction) =>
    transaction.name.toLowerCase().includes(filterName.toLowerCase()),
  );
};

export const sortTransactions = (transactions, sortType, sortOrder) => {
  if (sortType === "Recent") {
    sortedData = [...transactions].sort((a, b) => {
      return sortOrder === "Ascending"
        ? new Date(a.time) - new Date(b.time)
        : new Date(b.time) - new Date(a.time);
    });
  } else if (sortType === "Amount") {
    sortedData = [...transactions].sort((a, b) => {
      return sortOrder === "Ascending"
        ? a.amount - b.amount
        : b.amount - a.amount;
    });
  } else if (sortType === "Category") {
    sortedData = [...transactions].sort((a, b) => {
      return sortOrder === "Ascending"
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category);
    });
  }
  return sortedData;
};
