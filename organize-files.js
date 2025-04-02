const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "src");

const structure = {
  components: ["Header", "Footer", "Sidebar", "PrivateRoute", "BarChart", "LineChart", "DoughnutChart"],
  layouts: ["AdminLayout", "AuthLayout"],
  hooks: ["useAuth"],
  utils: ["helpers", "constants"],
  config: ["firebase", "i18n", "tailwind.config"],
  styles: ["index", "darkmode", "reset"],
  modules: {
    analytics: ["AnalyticsManagement", "Dashboard", "AdvancedAnalytics", "InteractiveReports"],
    management: ["Management", "TaskManagement", "ProjectManagement", "CustomerManagement", "BranchManagement"],
    operations: ["OperationsManagement", "Operations", "InvoiceManagement", "SalesManagement"],
    reports: ["ReportsManagement", "Reports", "ExportReports", "AdvancedReports"],
    settings: ["Settings", "GeneralSettings", "AdvancedSettings", "SecuritySettings", "AdvancedConfiguration"],
    notifications: ["NotificationManagement", "AdvancedNotifications", "CustomNotificationsManagement"],
    roles: ["RoleManagement", "AdvancedRoleManagement"],
    users: ["UserManagement", "Login", "Register", "ChangePassword"],
  },
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function moveFile(file, dest) {
  const srcPath = path.join(baseDir, file);
  const destPath = path.join(dest, file);
  if (!fs.existsSync(srcPath)) return;

  ensureDir(path.dirname(destPath));
  fs.renameSync(srcPath, destPath);
  console.log(`✅ Moved: ${file} → ${dest}`);
}

function scanAndMove() {
  const files = fs.readdirSync(baseDir);

  // التعامل مع ملفات عامة
  files.forEach((file) => {
    const name = file.replace(/\.(jsx|js|css)$/, "");

    // ملفات components
    if (structure.components.includes(name)) {
      const isChart = ["BarChart", "LineChart", "DoughnutChart"].includes(name);
      const target = isChart ? "components/charts" : "components/common";
      moveFile(file, path.join(baseDir, target));
      return;
    }

    // ملفات layouts
    if (structure.layouts.includes(name)) {
      moveFile(file, path.join(baseDir, "layouts"));
      return;
    }

    // ملفات hooks
    if (structure.hooks.includes(name)) {
      moveFile(file, path.join(baseDir, "hooks"));
      return;
    }

    // ملفات utils
    if (structure.utils.includes(name)) {
      moveFile(file, path.join(baseDir, "utils"));
      return;
    }

    // ملفات config
    if (structure.config.includes(name)) {
      moveFile(file, path.join(baseDir, "config"));
      return;
    }

    // ملفات styles
    if (structure.styles.includes(name)) {
      moveFile(file, path.join(baseDir, "styles"));
      return;
    }

    // ملفات modules
    for (const [modName, filesList] of Object.entries(structure.modules)) {
      if (filesList.includes(name)) {
        moveFile(file, path.join(baseDir, "modules", modName));
        return;
      }
    }
  });

  console.log("\n🎉 تم ترتيب المشروع بنجاح حسب هيكل wemarka!");
}

scanAndMove();
