import React, { useState, useEffect } from 'react';
import {
  getAdminUsers,
  updateUserStatus,
  updateUserRole,
  getAdminCompanies,
  verifyCompany,
  getAuditLogs,
} from '../services/api';

export default function AdminView({ currentUser, onShowToast }) {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'companies' | 'audit'
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, companiesData, logsData] = await Promise.all([
        getAdminUsers(),
        getAdminCompanies(),
        getAuditLogs(),
      ]);
      setUsers(usersData || []);
      setCompanies(companiesData || []);
      setAuditLogs(logsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleUserStatus = async (userId, currentEnabled) => {
    try {
      await updateUserStatus(userId, !currentEnabled, currentUser.id);
      onShowToast(`Đã ${!currentEnabled ? 'kích hoạt' : 'tạm khóa'} tài khoản`);
      loadData();
    } catch (err) {
      onShowToast(err.message || 'Lỗi cập nhật');
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole, currentUser.id);
      onShowToast(`Đã phân quyền thành: ${newRole}`);
      loadData();
    } catch (err) {
      onShowToast(err.message || 'Lỗi phân quyền');
    }
  };

  const handleToggleCompanyVerification = async (companyId, currentVerified) => {
    try {
      await verifyCompany(companyId, !currentVerified, currentUser.id);
      onShowToast(`Đã ${!currentVerified ? 'xác thực' : 'hủy xác thực'} doanh nghiệp`);
      loadData();
    } catch (err) {
      onShowToast(err.message || 'Lỗi xác thực');
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN': return <span className="badge badge-danger">ADMIN</span>;
      case 'MODERATOR': return <span className="badge badge-warning">MODERATOR</span>;
      case 'RECRUITER': return <span className="badge badge-purple">RECRUITER</span>;
      case 'CANDIDATE': return <span className="badge badge-primary">CANDIDATE</span>;
      default: return <span className="badge badge-neutral">{role}</span>;
    }
  };

  return (
    <div>
      <nav className="tabs-nav" role="tablist">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Quản lý người dùng ({users.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'companies' ? 'active' : ''}`}
          onClick={() => setActiveTab('companies')}
        >
          Xác thực doanh nghiệp ({companies.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          Nhật ký hệ thống ({auditLogs.length})
        </button>
      </nav>

      {/* TAB 1: USERS GOVERNANCE */}
      {activeTab === 'users' && (
        <section>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-header">
              <div>
                <h2>Quản trị tài khoản & Phân quyền thành viên</h2>
                <p>
                  Kiểm soát trạng thái tài khoản, đình chỉ vi phạm và gán vai trò theo chính sách quản trị.
                </p>
              </div>
            </div>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã ID</th>
                  <th>Họ tên & Email</th>
                  <th>Số điện thoại</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Phân quyền</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td><strong>#{u.id}</strong></td>
                    <td>
                      <strong>{u.fullName}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </td>
                    <td>{u.phoneNumber || '---'}</td>
                    <td>{getRoleBadge(u.role)}</td>
                    <td>
                      <span className={`badge ${u.enabled ? 'badge-success' : 'badge-danger'}`}>
                        {u.enabled ? 'Hoạt động' : 'Tạm khóa'}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding: '4px 8px', fontSize: '0.75rem', width: 'auto' }}
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                      >
                        <option value="CANDIDATE">CANDIDATE</option>
                        <option value="RECRUITER">RECRUITER</option>
                        <option value="MODERATOR">MODERATOR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`btn btn-sm ${u.enabled ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={() => handleToggleUserStatus(u.id, u.enabled)}
                      >
                        {u.enabled ? 'Khóa tài khoản' : 'Mở khóa'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 2: COMPANIES VERIFICATION */}
      {activeTab === 'companies' && (
        <section>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-header">
              <div>
                <h2>Xác thực hồ sơ doanh nghiệp tuyển dụng</h2>
                <p>
                  Cấp huy hiệu xác minh cho nhà tuyển dụng uy tín để gia tăng độ tin cậy đối với ứng viên IT.
                </p>
              </div>
            </div>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tên công ty</th>
                  <th>Trụ sở / Địa điểm</th>
                  <th>Lĩnh vực</th>
                  <th>Website</th>
                  <th>Tình trạng</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((comp) => (
                  <tr key={comp.id}>
                    <td>
                      <strong>{comp.name}</strong>
                    </td>
                    <td>{comp.location}</td>
                    <td>{comp.industry || 'IT & Phần mềm'}</td>
                    <td>
                      {comp.website ? (
                        <a href={comp.website} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                          {comp.website}
                        </a>
                      ) : '---'}
                    </td>
                    <td>
                      <span className={`badge ${comp.verified ? 'badge-success' : 'badge-neutral'}`}>
                        {comp.verified ? 'Đã xác thực' : 'Chưa xác thực'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`btn btn-sm ${comp.verified ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={() => handleToggleCompanyVerification(comp.id, comp.verified)}
                      >
                        {comp.verified ? 'Bỏ xác minh' : 'Duyệt xác minh'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 3: SYSTEM AUDIT LOGS */}
      {activeTab === 'audit' && (
        <section>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-header">
              <div>
                <h2>Nhật ký hành động & Audit Trail hệ thống</h2>
                <p>
                  Truy vết toàn bộ các thao tác bảo mật, thay đổi quyền hạn, kiểm duyệt và quản trị.
                </p>
              </div>
            </div>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã Log</th>
                  <th>Người thực hiện</th>
                  <th>Hành động</th>
                  <th>Đối tượng</th>
                  <th>Chi tiết</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td><strong>#{log.id}</strong></td>
                    <td>
                      <strong>{log.actorName}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{log.actorUserId}</div>
                    </td>
                    <td><span className="badge badge-purple">{log.actionType}</span></td>
                    <td>{log.entityType} #{log.entityId}</td>
                    <td style={{ maxWidth: '300px', fontSize: '0.8125rem' }}>{log.details}</td>
                    <td>{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

