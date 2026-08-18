import React, { useState, useEffect } from 'react';
import { getModerationCases, resolveModerationCase } from '../services/api';

export default function ModeratorView({ currentUser, onShowToast }) {
  const [cases, setCases] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedCase, setSelectedCase] = useState(null);
  const [resolutionText, setResolutionText] = useState('');
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getModerationCases();
      setCases(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResolve = async (caseId, status) => {
    try {
      await resolveModerationCase(caseId, status, resolutionText, currentUser.id);
      onShowToast(`✓ Đã xử lý case kiểm duyệt: ${status}`);
      setSelectedCase(null);
      setResolutionText('');
      loadData();
    } catch (err) {
      onShowToast('⚠️ ' + (err.message || 'Lỗi xử lý case'));
    }
  };

  const filteredCases = cases.filter((c) => {
    if (filterStatus === 'ALL') return true;
    return c.status === filterStatus;
  });

  const openCasesCount = cases.filter((c) => c.status === 'OPEN').length;

  return (
    <div>
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2>🛡️ Bàn làm việc Kiểm duyệt viên (Moderation Queue)</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Xử lý các báo cáo vi phạm nội dung, tin tuyển dụng giả mạo, bảo vệ chất lượng sàn tuyển dụng IT.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge badge-danger" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
              ⚠️ {openCasesCount} trường hợp cần xử lý
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button
            type="button"
            className={`btn btn-sm ${filterStatus === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStatus('ALL')}
          >
            Tất cả ({cases.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filterStatus === 'OPEN' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStatus('OPEN')}
          >
            Chờ xử lý ({openCasesCount})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filterStatus === 'RESOLVED' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStatus('RESOLVED')}
          >
            Đã duyệt hợp lệ
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filterStatus === 'REJECTED' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStatus('REJECTED')}
          >
            Đã gỡ bỏ vi phạm
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          Đang tải danh sách hàng đợi kiểm duyệt...
        </p>
      ) : filteredCases.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3>Không có báo cáo nào trong danh mục này</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Hệ thống đang hoạt động an toàn và không có vi phạm tồn đọng.
          </p>
        </div>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã Case</th>
                <th>Đối tượng báo cáo</th>
                <th>Người báo cáo</th>
                <th>Lý do vi phạm</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((c) => (
                <tr key={c.id}>
                  <td><strong>#{c.id}</strong></td>
                  <td>
                    <strong>{c.subjectTitle}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Loại: {c.subjectType} (ID: {c.subjectId})
                    </div>
                  </td>
                  <td>{c.reporterName || 'Người dùng'}</td>
                  <td style={{ maxWidth: '280px' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{c.reason}</p>
                    {c.resolution && (
                      <small style={{ color: 'var(--primary-text)', display: 'block', marginTop: '4px' }}>
                        💡 Kết luận: {c.resolution}
                      </small>
                    )}
                  </td>
                  <td>{new Date(c.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <span className={`badge ${
                      c.status === 'OPEN' ? 'badge-danger' :
                      c.status === 'RESOLVED' ? 'badge-success' : 'badge-neutral'
                    }`}>
                      {c.status === 'OPEN' ? 'Chờ kiểm duyệt' : c.status === 'RESOLVED' ? 'Đã duyệt giữ lại' : 'Đã gỡ bỏ'}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedCase(c)}
                    >
                      Xử lý case
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* RESOLUTION MODAL */}
      {selectedCase && (
        <div className="modal-overlay" onClick={() => setSelectedCase(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Xử lý kiểm duyệt: #{selectedCase.id}</h2>
              <button type="button" className="modal-close-btn" onClick={() => setSelectedCase(null)}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <h4>Đối tượng bị báo cáo:</h4>
                <p><strong>{selectedCase.subjectTitle}</strong> ({selectedCase.subjectType} #{selectedCase.subjectId})</p>
              </div>

              <div>
                <h4>Nội dung khiếu nại / lý do:</h4>
                <p style={{ background: 'var(--bg)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  {selectedCase.reason}
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Ghi chú quyết định xử lý (*)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  placeholder="Nhập lý do kết luận xử lý cho case này..."
                />
              </div>

              <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedCase(null)}>
                  Đóng
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => handleResolve(selectedCase.id, 'RESOLVED')}
                  >
                    ✓ Duyệt hợp lệ (Giữ nguyên tin)
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleResolve(selectedCase.id, 'REJECTED')}
                  >
                    ✕ Gỡ bỏ & Từ chối tin tuyển dụng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
