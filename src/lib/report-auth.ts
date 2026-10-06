export function reportSessionKey(token: string): string {
  return `greenx7_report_auth_${token}`;
}

/**
 * Mật khẩu báo cáo của tab đang mở — cần cho nút Export PDF (máy chủ kiểm tra
 * lại mật khẩu ở mỗi lần xuất). Chỉ sống trong sessionStorage của tab này, cùng
 * chỗ với dữ liệu báo cáo đã mở khoá, đóng tab là mất.
 */
export function reportPasswordKey(token: string): string {
  return `greenx7_report_pw_${token}`;
}
