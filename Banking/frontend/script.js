/*******************************
 * Backend API Base URL
 *******************************/
const API_BASE = "http://localhost:5000";

/*******************************
 * DOM Elements
 *******************************/
const navLinks = document.querySelectorAll(".nav-link");
const pages = document.querySelectorAll(".page");

const totalUsersEl = document.getElementById("totalUsers");
const totalAccountsEl = document.getElementById("totalAccounts");
const totalTransactionsEl = document.getElementById("totalTransactions");
const totalBalanceEl = document.getElementById("totalBalance");
const txnTableRecent = document.getElementById("txnTableRecent");

const usersTable = document.getElementById("usersTable");
const accountsTable = document.getElementById("accountsTable");
const txnTableAll = document.getElementById("txnTableAll");
const auditTable = document.getElementById("auditTable");

const depositBtn = document.getElementById("depositBtn");
const withdrawBtn = document.getElementById("withdrawBtn");
const transferBtn = document.getElementById("transferBtn");

const refreshUsersBtn = document.getElementById("refreshUsersBtn");
const refreshAccountsBtn = document.getElementById("refreshAccountsBtn");
const refreshTransactionsBtn = document.getElementById("refreshTransactionsBtn");
const refreshAuditBtn = document.getElementById("refreshAuditBtn");

const createCustomerBtn = document.getElementById("createCustomerBtn");
const createCustomerMsg = document.getElementById("createCustomerMsg");
const resequenceAccountsBtn = document.getElementById("resequenceAccountsBtn");

const confirmModal = document.getElementById("confirmModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalCancel = document.getElementById("modalCancel");
const modalConfirm = document.getElementById("modalConfirm");

/*******************************
 * UI Helpers
 *******************************/
function ensureToastContainer() {
    let el = document.getElementById("toastContainer");
    if (el) return el;
    el = document.createElement("div");
    el.id = "toastContainer";
    el.className = "toast-container";
    el.style.cssText = "position:fixed;right:16px;bottom:16px;z-index:9999;display:flex;flex-direction:column;gap:10px;";
    document.body.appendChild(el);
    return el;
}

function showToast(message, type = "info", timeoutMs = 3000) {
    const container = ensureToastContainer();
    const toast = document.createElement("div");
    const bg = type === "success" ? "#16a34a" : type === "error" ? "#dc2626" : type === "warn" ? "#d97706" : "#111827";
    toast.style.cssText = `background:${bg};color:white;padding:10px 12px;border-radius:10px;box-shadow:0 10px 25px rgba(0,0,0,.18);max-width:360px;font-size:14px;display:flex;align-items:center;gap:10px;`;
    toast.setAttribute("role", "alert");

    const text = document.createElement("span");
    text.textContent = message;

    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "×";
    close.style.cssText = "margin-left:auto;border:none;background:transparent;color:white;font-size:18px;cursor:pointer;padding:0 4px;";
    close.setAttribute("aria-label", "Close");
    close.onclick = () => toast.remove();

    toast.appendChild(text);
    toast.appendChild(close);
    container.appendChild(toast);

    if (timeoutMs > 0) setTimeout(() => toast.remove(), timeoutMs);
}

function formatINR(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) return "-";
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(num);
}

function escapeHtml(s) {
    return String(s ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function setButtonLoading(btn, isLoading, loadingText = "Please wait...") {
    if (!btn) return;
    if (isLoading) {
        btn.dataset._oldText = btn.textContent;
        btn.textContent = loadingText;
        btn.disabled = true;
        btn.style.opacity = "0.8";
        btn.style.cursor = "not-allowed";
    } else {
        btn.textContent = btn.dataset._oldText || btn.textContent;
        btn.disabled = false;
        btn.style.opacity = "";
        btn.style.cursor = "";
    }
}

function setRefreshLoading(btn, isLoading) {
    if (!btn) return;
    btn.classList.toggle("is-refreshing", isLoading);
    btn.disabled = isLoading;
}

async function fetchJson(url, options) {
    const res = await fetch(url, options);
    const isJson = (res.headers.get("content-type") || "").includes("application/json");
    const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);
    if (!res.ok) {
        const message = (data && typeof data === "object" && data.message) ? data.message : `Request failed: ${res.status}`;
        const err = new Error(message);
        err.status = res.status;
        err.data = data;
        throw err;
    }
    return data;
}

/*******************************
 * Confirm Modal
 *******************************/
function openConfirm(options) {
    return new Promise((resolve) => {
        modalTitle.textContent = options.title || "Confirm";
        modalMessage.textContent = options.message || "Are you sure?";
        confirmModal.setAttribute("aria-hidden", "false");
        confirmModal.classList.add("is-open");

        const close = (result) => {
            confirmModal.classList.remove("is-open");
            confirmModal.setAttribute("aria-hidden", "true");
            modalCancel.onclick = null;
            modalConfirm.onclick = null;
            confirmModal.onkeydown = null;
            resolve(result);
        };

        modalCancel.onclick = () => close(false);
        modalConfirm.onclick = () => close(true);
        confirmModal.onkeydown = (e) => {
            if (e.key === "Escape") close(false);
        };
        modalCancel.focus();
    });
}

/*******************************
 * Page transition & scroll
 *******************************/
function setActivePage(pageName) {
    pages.forEach((p) => p.classList.remove("active"));
    navLinks.forEach((a) => a.classList.remove("active"));

    const pageEl = document.getElementById(`page-${pageName}`);
    if (pageEl) {
        pageEl.classList.add("active");
        pageEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const activeLink = document.querySelector(`.nav-link[data-page="${pageName}"]`);
    if (activeLink) activeLink.classList.add("active");
}

/*******************************
 * Loading skeletons for tables
 *******************************/
function showTableSkeleton(tbody, rows = 5, cols = 5) {
    tbody.innerHTML = "";
    for (let r = 0; r < rows; r++) {
        const tr = document.createElement("tr");
        for (let c = 0; c < cols; c++) {
            const td = document.createElement("td");
            td.innerHTML = '<span class="skeleton" style="display:block;height:20px;"></span>';
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
}

function setTableSectionLoading(section, loading) {
    if (!section) return;
    section.classList.toggle("is-loading", !!loading);
}

/*******************************
 * Count-up animation for stats
 *******************************/
function animateValue(el, start, end, duration = 600) {
    if (!el) return;
    const isCurrency = el === totalBalanceEl;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 2);
        const current = start + (end - start) * easeOut;

        if (isCurrency) {
            el.textContent = formatINR(current);
        } else {
            el.textContent = Math.round(current);
        }

        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

/*******************************
 * Table search/filter
 *******************************/
function addTableSearch(container, tbody, getRowText) {
    if (!container || !tbody) return;
    const existing = container.querySelector(".search-bar");
    if (existing) existing.remove();

    const wrap = document.createElement("div");
    wrap.className = "search-bar";
    const input = document.createElement("input");
    input.type = "search";
    input.placeholder = "Filter table...";
    input.setAttribute("aria-label", "Search table");

    input.addEventListener("input", () => {
        const q = input.value.trim().toLowerCase();
        const rows = tbody.querySelectorAll("tr");
        rows.forEach((tr) => {
            if (tr.classList.contains("empty-row")) return;
            const text = (getRowText ? getRowText(tr) : tr.textContent) || "";
            tr.style.display = !q || text.toLowerCase().includes(q) ? "" : "none";
        });
    });

    const tableContainer = container.querySelector(".table-container");
    container.insertBefore(wrap, tableContainer || container.firstChild);
}

/*******************************
 * Copy to clipboard (for account numbers etc.)
 *******************************/
function setupCopyCells(tbody) {
    if (!tbody) return;
    tbody.querySelectorAll("td[data-copy]").forEach((td) => {
        td.addEventListener("click", () => {
            const value = td.getAttribute("data-copy") || td.textContent.trim();
            navigator.clipboard.writeText(value).then(() => {
                showToast("Copied to clipboard", "success", 1500);
            }).catch(() => {});
        });
    });
}

/*******************************
 * Form validation (real-time)
 *******************************/
function addValidation(input, validate) {
    if (!input) return;
    const formGroup = input.closest(".form-group");
    if (!formGroup) return;

    let hint = formGroup.querySelector(".input-hint");
    if (!hint) {
        hint = document.createElement("div");
        hint.className = "input-hint";
        formGroup.appendChild(hint);
    }

    function runValidation() {
        const result = validate(input.value);
        input.classList.remove("is-invalid", "is-valid");
        hint.classList.remove("error");
        hint.textContent = "";
        if (result === true) {
            input.classList.add("is-valid");
        } else if (typeof result === "string") {
            input.classList.add("is-invalid");
            hint.classList.add("error");
            hint.textContent = result;
        }
    }

    input.addEventListener("blur", runValidation);
    input.addEventListener("input", () => {
        if (input.classList.contains("is-invalid") || input.classList.contains("is-valid")) runValidation();
    });
}

/*******************************
 * Load Dashboard Stats (with count-up)
 *******************************/
async function loadStats() {
    try {
        const data = await fetchJson(`${API_BASE}/stats`);
        const users = Number(data.totalUsers) || 0;
        const accounts = Number(data.totalAccounts) || 0;
        const txns = Number(data.totalTransactions) || 0;
        const balance = Number(data.totalBalance) || 0;

        animateValue(totalUsersEl, 0, users);
        animateValue(totalAccountsEl, 0, accounts);
        animateValue(totalTransactionsEl, 0, txns);
        animateValue(totalBalanceEl, 0, balance);
    } catch (err) {
        console.error("Stats load failed:", err);
        totalUsersEl.textContent = "-";
        totalAccountsEl.textContent = "-";
        totalTransactionsEl.textContent = "-";
        totalBalanceEl.textContent = formatINR(0);
        showToast(err?.message || "Backend not running / stats API error", "error");
    }
}

/*******************************
 * Navigation
 *******************************/
function wireNavigation() {
    navLinks.forEach((link) => {
        link.addEventListener("click", async (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            setActivePage(page);

            if (page === "dashboard") {
                await loadStats();
                await loadTransactionsRecent();
            } else if (page === "users") {
                await loadUsers();
            } else if (page === "accounts") {
                await loadAccounts();
            } else if (page === "transactions") {
                await loadTransactionsAll();
            } else if (page === "audit") {
                await loadAuditLogs();
            }
        });
    });
}

/*******************************
 * Tables: render helpers
 *******************************/
function renderEmptyRow(tbodyEl, message, colSpan) {
    const row = document.createElement("tr");
    row.className = "empty-row";
    row.innerHTML = `<td colspan="${colSpan}">${escapeHtml(message)}</td>`;
    tbodyEl.innerHTML = "";
    tbodyEl.appendChild(row);
}

function highlightRow(row) {
    if (!row || row.classList.contains("empty-row")) return;
    row.classList.add("row-highlight");
    setTimeout(() => row.classList.remove("row-highlight"), 1500);
}

/*******************************
 * Load Tables
 *******************************/
async function loadTransactionsRecent() {
    const section = txnTableRecent?.closest(".table-section");
    if (section) setTableSectionLoading(section, true);
    try {
        const txns = await fetchJson(`${API_BASE}/transactions?limit=10`);
        txnTableRecent.innerHTML = "";

        if (!Array.isArray(txns) || txns.length === 0) {
            renderEmptyRow(txnTableRecent, "No transactions found.", 7);
            return;
        }

        txns.forEach((t) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${escapeHtml(t.transaction_id)}</td>
                <td>${escapeHtml(t.from_account ?? "-")}</td>
                <td>${escapeHtml(t.to_account ?? "-")}</td>
                <td>${escapeHtml(t.transaction_type)}</td>
                <td>${escapeHtml(formatINR(t.amount))}</td>
                <td>${escapeHtml(t.status)}</td>
                <td>${t.created_at ? new Date(t.created_at).toLocaleString() : "-"}</td>
            `;
            txnTableRecent.appendChild(row);
        });
    } catch (err) {
        console.error("Transactions load failed:", err);
        renderEmptyRow(txnTableRecent, "Could not load transactions.", 7);
        showToast(err?.message || "Transactions API error", "error");
    } finally {
        if (section) setTableSectionLoading(section, false);
    }
}

async function loadTransactionsAll() {
    const section = txnTableAll?.closest(".table-section");
    if (section) {
        setTableSectionLoading(section, true);
        showTableSkeleton(txnTableAll, 8, 7);
    }
    try {
        const txns = await fetchJson(`${API_BASE}/transactions?limit=100`);
        txnTableAll.innerHTML = "";

        if (!Array.isArray(txns) || txns.length === 0) {
            renderEmptyRow(txnTableAll, "No transactions found.", 7);
            return;
        }

        txns.forEach((t) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${escapeHtml(t.transaction_id)}</td>
                <td>${escapeHtml(t.from_account ?? "-")}</td>
                <td>${escapeHtml(t.to_account ?? "-")}</td>
                <td>${escapeHtml(t.transaction_type)}</td>
                <td>${escapeHtml(formatINR(t.amount))}</td>
                <td>${escapeHtml(t.status)}</td>
                <td>${t.created_at ? new Date(t.created_at).toLocaleString() : "-"}</td>
            `;
            txnTableAll.appendChild(row);
        });

        addTableSearch(section, txnTableAll);
    } catch (err) {
        console.error("Transactions(all) load failed:", err);
        renderEmptyRow(txnTableAll, "Could not load transactions.", 7);
        showToast(err?.message || "Transactions API error", "error");
    } finally {
        if (section) setTableSectionLoading(section, false);
    }
}

async function loadUsers() {
    const section = usersTable?.closest(".table-section");
    if (section) {
        setTableSectionLoading(section, true);
        showTableSkeleton(usersTable, 6, 5);
    }
    try {
        const users = await fetchJson(`${API_BASE}/users`);
        usersTable.innerHTML = "";

        if (!Array.isArray(users) || users.length === 0) {
            renderEmptyRow(usersTable, "No users found.", 5);
            return;
        }

        users.forEach((u) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${escapeHtml(u.user_id)}</td>
                <td>${escapeHtml(u.name)}</td>
                <td>${escapeHtml(u.email)}</td>
                <td>${escapeHtml(u.role)}</td>
                <td>${u.created_at ? new Date(u.created_at).toLocaleString() : "-"}</td>
            `;
            usersTable.appendChild(row);
        });

        addTableSearch(section, usersTable);
    } catch (err) {
        console.error("Users load failed:", err);
        renderEmptyRow(usersTable, "Could not load users.", 5);
        showToast(err?.message || "Users API error", "error");
    } finally {
        if (section) setTableSectionLoading(section, false);
    }
}

async function loadAccounts() {
    const section = accountsTable?.closest(".table-section");
    if (section) {
        setTableSectionLoading(section, true);
        showTableSkeleton(accountsTable, 6, 5);
    }
    try {
        const accounts = await fetchJson(`${API_BASE}/accounts`);
        accountsTable.innerHTML = "";

        if (!Array.isArray(accounts) || accounts.length === 0) {
            renderEmptyRow(accountsTable, "No accounts found.", 5);
            return;
        }

        accounts.forEach((a) => {
            const row = document.createElement("tr");
            const accNum = a.account_number ?? "-";
            row.innerHTML = `
                <td>${escapeHtml(a.account_id ?? "-")}</td>
                <td data-copy="${escapeHtml(accNum)}">${escapeHtml(accNum)}</td>
                <td>${escapeHtml(formatINR(a.balance))}</td>
                <td>${escapeHtml(a.status ?? "-")}</td>
                <td>${a.created_at ? new Date(a.created_at).toLocaleString() : "-"}</td>
            `;
            accountsTable.appendChild(row);
        });

        setupCopyCells(accountsTable);
        const container = accountsTable.closest(".main-content")?.querySelector("#page-accounts .table-section");
        addTableSearch(container, accountsTable);
    } catch (err) {
        console.error("Accounts load failed:", err);
        renderEmptyRow(accountsTable, "Could not load accounts.", 5);
        showToast(err?.message || "Accounts API error", "error");
    } finally {
        if (section) setTableSectionLoading(section, false);
    }
}

async function loadAuditLogs() {
    const section = auditTable?.closest(".table-section");
    if (section) {
        setTableSectionLoading(section, true);
        showTableSkeleton(auditTable, 8, 5);
    }
    try {
        const logs = await fetchJson(`${API_BASE}/audit?limit=100`);
        auditTable.innerHTML = "";

        if (!Array.isArray(logs) || logs.length === 0) {
            renderEmptyRow(auditTable, "No audit logs found.", 5);
            return;
        }

        logs.forEach((l) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${escapeHtml(l.audit_id ?? "-")}</td>
                <td>${escapeHtml(l.user_id ?? "-")}</td>
                <td>${escapeHtml(l.action ?? "-")}</td>
                <td>${escapeHtml(l.ip_address ?? "-")}</td>
                <td>${l.created_at ? new Date(l.created_at).toLocaleString() : "-"}</td>
            `;
            auditTable.appendChild(row);
        });

        addTableSearch(section, auditTable);
    } catch (err) {
        console.error("Audit load failed:", err);
        renderEmptyRow(auditTable, "Could not load audit logs.", 5);
        showToast(err?.message || "Audit API error", "error");
    } finally {
        if (section) setTableSectionLoading(section, false);
    }
}

/*******************************
 * Deposit
 *******************************/
depositBtn.addEventListener("click", async () => {
    const depositAcc = document.getElementById("depositAcc");
    const depositAmt = document.getElementById("depositAmt");
    const account_number = depositAcc.value.trim();
    const amount = parseFloat(depositAmt.value);

    if (!account_number || isNaN(amount) || amount <= 0) {
        showToast("Enter valid deposit details", "warn");
        return;
    }

    try {
        setButtonLoading(depositBtn, true, "Depositing...");
        const data = await fetchJson(`${API_BASE}/accounts/deposit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ account_number, amount }),
        });
        showToast(data.message || "Deposit done", "success");
        depositAcc.value = "";
        depositAmt.value = "";
        await loadStats();
        await loadTransactionsRecent();
    } catch (err) {
        console.error("Deposit failed:", err);
        showToast(err?.message || "Deposit failed", "error");
    } finally {
        setButtonLoading(depositBtn, false);
    }
});

/*******************************
 * Withdraw
 *******************************/
withdrawBtn.addEventListener("click", async () => {
    const withdrawAcc = document.getElementById("withdrawAcc");
    const withdrawAmt = document.getElementById("withdrawAmt");
    const account_number = withdrawAcc.value.trim();
    const amount = parseFloat(withdrawAmt.value);

    if (!account_number || isNaN(amount) || amount <= 0) {
        showToast("Enter valid withdrawal details", "warn");
        return;
    }

    try {
        setButtonLoading(withdrawBtn, true, "Withdrawing...");
        const data = await fetchJson(`${API_BASE}/accounts/withdraw`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ account_number, amount }),
        });
        showToast(data.message || "Withdrawal done", "success");
        withdrawAcc.value = "";
        withdrawAmt.value = "";
        await loadStats();
        await loadTransactionsRecent();
    } catch (err) {
        console.error("Withdraw failed:", err);
        showToast(err?.message || "Withdraw failed", "error");
    } finally {
        setButtonLoading(withdrawBtn, false);
    }
});

/*******************************
 * Transfer
 *******************************/
transferBtn.addEventListener("click", async () => {
    const fromAcc = document.getElementById("fromAcc");
    const toAcc = document.getElementById("toAcc");
    const transferAmt = document.getElementById("transferAmt");
    const from_account = fromAcc.value.trim();
    const to_account = toAcc.value.trim();
    const amount = parseFloat(transferAmt.value);

    if (!from_account || !to_account || isNaN(amount) || amount <= 0) {
        showToast("Enter valid transfer details", "warn");
        return;
    }

    if (from_account === to_account) {
        showToast("From and To account must be different", "warn");
        return;
    }

    try {
        setButtonLoading(transferBtn, true, "Transferring...");
        const data = await fetchJson(`${API_BASE}/accounts/transfer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ from_account, to_account, amount }),
        });
        showToast(data.message || "Transfer done", "success");
        fromAcc.value = "";
        toAcc.value = "";
        transferAmt.value = "";
        await loadStats();
        await loadTransactionsRecent();
    } catch (err) {
        console.error("Transfer failed:", err);
        showToast(err?.message || "Transfer failed", "error");
    } finally {
        setButtonLoading(transferBtn, false);
    }
});

/*******************************
 * Create Customer + validation
 *******************************/
const customerName = document.getElementById("customerName");
const customerEmail = document.getElementById("customerEmail");
const customerPassword = document.getElementById("customerPassword");

addValidation(customerName, (v) => {
    const t = v.trim();
    if (!t) return "Name is required";
    if (t.length < 2) return "Name must be at least 2 characters";
    return true;
});

addValidation(customerEmail, (v) => {
    const t = v.trim();
    if (!t) return "Email is required";
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(t)) return "Enter a valid email address";
    return true;
});

createCustomerBtn.addEventListener("click", async () => {
    const name = customerName.value.trim();
    const email = customerEmail.value.trim();
    const role = document.getElementById("customerRole").value;
    const password = customerPassword.value;

    createCustomerMsg.textContent = "";

    if (!name || !email) {
        createCustomerMsg.textContent = "Name and email are required.";
        showToast("Name and email are required.", "warn");
        return;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
        showToast("Enter a valid email address", "warn");
        return;
    }

    try {
        setButtonLoading(createCustomerBtn, true, "Creating...");
        const data = await fetchJson(`${API_BASE}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, role, password }),
        });

        const accInfo = data?.account?.account_number
            ? ` Account Number: ${data.account.account_number} (balance ₹0).`
            : "";
        createCustomerMsg.textContent = (data?.message || "Customer created.") + accInfo;
        createCustomerMsg.style.color = "#16a34a";
        showToast(data?.message || "Customer created.", "success");
        customerName.value = "";
        customerEmail.value = "";
        customerPassword.value = "";
        customerName.classList.remove("is-valid");
        customerEmail.classList.remove("is-valid");
        createFormDirty = false;

        await loadUsers();
        await loadStats();
        const newRow = usersTable.querySelector("tr:first-child");
        if (newRow && !newRow.classList.contains("empty-row")) highlightRow(newRow);
    } catch (err) {
        console.error("Create customer failed:", err);
        createCustomerMsg.textContent = err?.message || "Create customer failed.";
        createCustomerMsg.style.color = "#dc2626";
        showToast(err?.message || "Create customer failed.", "error");
    } finally {
        setButtonLoading(createCustomerBtn, false);
    }
});

/*******************************
 * Refresh buttons (with spin)
 *******************************/
async function refreshWithFeedback(btn, loadFn) {
    setRefreshLoading(btn, true);
    try {
        await loadFn();
        showToast("Refreshed", "success", 1500);
    } catch (e) {
        // error already shown in loadFn
    } finally {
        setRefreshLoading(btn, false);
    }
}

refreshUsersBtn.addEventListener("click", () => refreshWithFeedback(refreshUsersBtn, loadUsers));
refreshAccountsBtn.addEventListener("click", () => refreshWithFeedback(refreshAccountsBtn, loadAccounts));
refreshTransactionsBtn.addEventListener("click", () => refreshWithFeedback(refreshTransactionsBtn, loadTransactionsAll));
refreshAuditBtn.addEventListener("click", () => refreshWithFeedback(refreshAuditBtn, loadAuditLogs));

/*******************************
 * Resequence (with modal)
 *******************************/
resequenceAccountsBtn.addEventListener("click", async () => {
    const confirmed = await openConfirm({
        title: "Resequence account numbers",
        message: "This will resequence all account numbers. This action cannot be undone. Continue?",
    });
    if (!confirmed) return;

    try {
        setButtonLoading(resequenceAccountsBtn, true, "Resequencing...");
        const data = await fetchJson(`${API_BASE}/accounts/resequence`, { method: "POST" });
        showToast(data?.message || "Resequence finished.", "success");
        await loadAccounts();
    } catch (err) {
        console.error("Resequence accounts failed:", err);
        showToast(err?.message || "Failed to resequence accounts.", "error");
    } finally {
        setButtonLoading(resequenceAccountsBtn, false);
    }
});

/*******************************
 * Keyboard: Escape closes toasts/modal; Enter in modal confirms
 *******************************/
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        if (confirmModal.classList.contains("is-open")) {
            confirmModal.classList.remove("is-open");
            modalCancel.click();
        }
        document.querySelectorAll("#toastContainer > div").forEach((t) => t.remove());
    }
});

/*******************************
 * Form submit prevention (prevent accidental form submit)
 *******************************/
document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (e) => e.preventDefault());
});

/*******************************
 * Enter key submits in forms (Deposit, Withdraw, Transfer, Create Customer)
 *******************************/
function onEnterSubmit(inputs, submitBtn, submitFn) {
    if (!inputs.length || !submitBtn) return;
    inputs.forEach((input) => {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                if (typeof submitFn === "function") submitFn();
                else submitBtn.click();
            }
        });
    });
}

onEnterSubmit(
    [document.getElementById("depositAcc"), document.getElementById("depositAmt")],
    depositBtn,
    () => depositBtn.click()
);
onEnterSubmit(
    [document.getElementById("withdrawAcc"), document.getElementById("withdrawAmt")],
    withdrawBtn,
    () => withdrawBtn.click()
);
onEnterSubmit(
    [document.getElementById("fromAcc"), document.getElementById("toAcc"), document.getElementById("transferAmt")],
    transferBtn,
    () => transferBtn.click()
);
onEnterSubmit(
    [customerName, customerEmail, customerPassword, document.getElementById("customerRole")],
    createCustomerBtn,
    () => createCustomerBtn.click()
);

/*******************************
 * Modal: click overlay to close; Enter to confirm
 *******************************/
if (confirmModal) {
    confirmModal.addEventListener("click", (e) => {
        if (e.target === confirmModal) {
            confirmModal.classList.remove("is-open");
            modalCancel.click();
        }
    });
    const modalDialog = confirmModal.querySelector(".modal");
    if (modalDialog) {
        modalDialog.addEventListener("click", (e) => e.stopPropagation());
    }
}

modalConfirm.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && confirmModal.classList.contains("is-open")) {
        e.preventDefault();
        modalConfirm.click();
    }
});

/*******************************
 * Input events: amount fields accept only numbers and one decimal
 *******************************/
function wireAmountInput(input) {
    if (!input) return;
    input.addEventListener("input", (e) => {
        let v = e.target.value;
        v = v.replace(/[^\d.]/g, "");
        const parts = v.split(".");
        if (parts.length > 2) v = parts[0] + "." + parts.slice(1).join("");
        if (parts.length === 2 && parts[1].length > 2) v = parts[0] + "." + parts[1].slice(0, 2);
        e.target.value = v;
    });
    input.addEventListener("paste", (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData("text").replace(/[^\d.]/g, "");
        const parts = text.split(".");
        const pasted = parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : text;
        if (parts.length === 2 && parts[1].length > 2) e.target.value = parts[0] + "." + parts[1].slice(0, 2);
        else e.target.value = pasted;
    });
}

wireAmountInput(document.getElementById("depositAmt"));
wireAmountInput(document.getElementById("withdrawAmt"));
wireAmountInput(document.getElementById("transferAmt"));

/*******************************
 * Account number inputs: numbers only (optional trim spaces)
 *******************************/
function wireAccountNumberInput(input) {
    if (!input) return;
    input.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "");
    });
    input.addEventListener("paste", (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "");
        e.target.value = text;
    });
}

wireAccountNumberInput(document.getElementById("depositAcc"));
wireAccountNumberInput(document.getElementById("withdrawAcc"));
wireAccountNumberInput(document.getElementById("fromAcc"));
wireAccountNumberInput(document.getElementById("toAcc"));

/*******************************
 * Accordion: focus first input when opened
 *******************************/
document.querySelectorAll(".action-accordion").forEach((details) => {
    details.addEventListener("toggle", () => {
        if (details.open) {
            const firstInput = details.querySelector("input");
            if (firstInput) setTimeout(() => firstInput.focus(), 100);
        }
    });
});

/*******************************
 * Nav link: prevent default and handle middle-click
 *******************************/
navLinks.forEach((link) => {
    link.addEventListener("click", (e) => e.preventDefault());
});

/*******************************
 * Table row double-click: copy first cell (e.g. ID or account number)
 *******************************/
function wireTableRowDoubleClick(tbody, copyCellIndex = 0) {
    if (!tbody) return;
    tbody.addEventListener("dblclick", (e) => {
        const row = e.target.closest("tr");
        if (!row || row.classList.contains("empty-row")) return;
        const cells = row.querySelectorAll("td");
        const cell = cells[copyCellIndex];
        if (!cell) return;
        const text = (cell.getAttribute("data-copy") || cell.textContent || "").trim();
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => showToast("Copied: " + text, "success", 1500)).catch(() => {});
    });
}

wireTableRowDoubleClick(usersTable, 0);
wireTableRowDoubleClick(accountsTable, 1);
wireTableRowDoubleClick(txnTableAll, 0);
wireTableRowDoubleClick(txnTableRecent, 0);
wireTableRowDoubleClick(auditTable, 0);

/*******************************
 * Beforeunload: warn if Create Customer form has unsaved input
 *******************************/
let createFormDirty = false;
[customerName, customerEmail, customerPassword].forEach((el) => {
    if (!el) return;
    el.addEventListener("input", () => { createFormDirty = true; });
    el.addEventListener("change", () => { createFormDirty = true; });
});
window.addEventListener("beforeunload", (e) => {
    if (createFormDirty && (customerName?.value.trim() || customerEmail?.value.trim())) {
        e.preventDefault();
    }
});

// createFormDirty is reset inside create customer success path (see createCustomerBtn handler)

/*******************************
 * Init
 *******************************/
wireNavigation();
setActivePage("dashboard");
loadStats();
loadTransactionsRecent();

setInterval(() => {
    const dashboard = document.getElementById("page-dashboard");
    if (dashboard?.classList.contains("active")) {
        loadStats();
        loadTransactionsRecent();
    }
}, 15000);
