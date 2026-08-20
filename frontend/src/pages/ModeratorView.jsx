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
      onShowToast(`Đã xử lý case kiểm duyệt: ${status}`);
      setSelectedCase(null);
      setResolutionText('');
      loadData();
    } catch (err) {
      onShowToast(err.message || 'Lỗi xử lý case');
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
        <div className="card-header" style={{ flexWrap: 'wrap' }}>
          <div>
            <h2>Bàn làm việc Kiểm duyệt</h2>
            <p>
              Xử lý các báo cáo vi phạm nội dung và tin tuyển dụng không đúng quy định.
            </p>
          </div>

          <div>
            <span className="badge badge-warning" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
              {openCasesCount} trường hợp cần xử lý
            </span>
          </div>
        </div>

        <div className="filter-chips" style={{ marginTop: '12px' }}>
          <button
            type="button"
            className={`filter-chip-btn ${filterStatus === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterStatus('ALL')}
          >
            Tất cả ({cases.length})
          </button>
          <button
            type="button"
            className={`filter-chip-btn ${filterStatus === 'OPEN' ? 'active' : ''}`}
            onClick={() => setFilterStatus('OPEN')}
          >
            Chờ xử lý ({openCasesCount})
          </button>
          <button
            type="button"
            className={`filter-chip-btn ${filterStatus === 'RESOLVED' ? 'active' : ''}`}
            onClick={() => setFilterStatus('RESOLVED')}
          >
            Đã duyệt hợp lệ
          </button>
          <button
            type="button"
            className={`filter-chip-btn ${filterStatus === 'REJECTED' ? 'active' : ''}`}
            onClick={() => setFilterStatus('REJECTED')}
          >
            Đã gỡ bỏ vi phạm
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <p>Đang tải danh sách hàng đợi kiểm duyệt...</p>
        </div>
      ) : filteredCases.length === 0 ? (
        <div className="card empty-state">
          <h3>Không có báo cáo nào trong danh mục này</h3>
          <p>
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
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Loại: {c.subjectType} (ID: {c.subjectId})
                    </div>
                  </td>
                  <td>{c.reporterName || 'Người dùng'}</td>
                  <td style={{ maxWidth: '280px' }}>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-main)', lineHeight: '1.5' }}>{c.reason}</p>
                    {c.resolution && (
                      <span style={{ color: 'var(--primary-text)', display: 'block', marginTop: '4px', fontSize: '0.75rem' }}>
                        Kết luận: {c.resolution}
                      </span>
                    )}
                  </td>
                  <td>{new Date(c.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <span className={`badge ${
                      c.status === 'OPEN' ? 'badge-warning' :
                      c.status === 'RESOLVED' ? 'badge-success' : 'badge-danger'
                    }`}>
                      {c.status === 'OPEN' ? 'Chờ duyệt' : c.status === 'RESOLVED' ? 'Giữ lại' : 'Đã gỡ bỏ'}
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
              <div>
                <h2>Xử lý kiểm duyệt #{selectedCase.id}</h2>
                <p>Xem xét khiếu nại và đưa ra kết luận xử lý</p>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setSelectedCase(null)} aria-label="Đóng">&times;</button>
            </div>

            <div className="modal-body">
              <div>
                <h4 className="modal-section-title">Đối tượng bị báo cáo</h4>
                <p style={{ color: 'var(--text-main)' }}><strong>{selectedCase.subjectTitle}</strong> ({selectedCase.subjectType} #{selectedCase.subjectId})</p>
              </div>

              <div>
                <h4 className="modal-section-title">Nội dung khiếu nại / lý do</h4>
                <p style={{ background: 'var(--surface-subtle)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
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
                  placeholder="Nhập lý do kết luận xử lý cho trường hợp này..."
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
                    Duyệt hợp lệ (Giữ lại)
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleResolve(selectedCase.id, 'REJECTED')}
                  >
                    Gỡ bỏ & Từ chối tin
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

