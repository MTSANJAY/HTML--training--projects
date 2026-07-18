import { useState } from "react";

function LeaveRequests({ user, role, leaveRequests, onApplyLeave, onUpdateLeaveStatus }) {
  // Employee state
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  // Admin state for handling approval comment inputs
  const [reviewingId, setReviewingId] = useState(null);
  const [comments, setComments] = useState("Approved to build automation testing");
  const [actionType, setActionType] = useState(""); // "Approved" or "Rejected"

  const handleApply = (e) => {
    e.preventDefault();
    if (!leaveType || !startDate || !endDate || !reason) {
      alert("Please fill all leave fields.");
      return;
    }

    // Calculate total days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    if (timeDiff < 0) {
      alert("End date cannot be before start date.");
      return;
    }
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    // Auto-formatted applied date (DD-MM-YYYY)
    const today = new Date();
    const appliedDate = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;

    // Format dates to DD-MM-YYYY for display
    const formatDateStr = (dateStr) => {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      return dateStr;
    };

    onApplyLeave({
      employeeId: user.id || "101",
      employeeName: user.name || "Employee",
      leaveType,
      startDate: formatDateStr(startDate),
      endDate: formatDateStr(endDate),
      totalDays,
      reason,
      appliedDate,
    });

    // Reset form
    setLeaveType("");
    setStartDate("");
    setEndDate("");
    setReason("");
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    onUpdateLeaveStatus(reviewingId, actionType, comments, "HR Manager");
    setReviewingId(null);
    setComments("Approved to build automation testing");
    setActionType("");
  };

  // Filter requests based on role
  const filteredRequests =
    role === "admin"
      ? leaveRequests
      : leaveRequests.filter((req) => String(req.employeeId) === String(user.id));

  return (
    <div className="leave-requests-container">
      {role === "employee" ? (
        <div className="leave-grid-layout">
          {/* Apply Leave Form */}
          <div className="leave-card-form">
            <h2>Request Leave</h2>
            <form onSubmit={handleApply} className="leave-form-fields">
              <div className="form-group">
                <label>Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  required
                >
                  <option value="">Select Leave Type</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Annual Leave">Annual Leave</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reason</label>
                <textarea
                  placeholder="Reason for leave"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows="3"
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn apply-btn">
                Submit Request
              </button>
            </form>
          </div>

          {/* Employee Leave History */}
          <div className="leave-history">
            <h2>My Leave History</h2>
            {filteredRequests.length === 0 ? (
              <div className="empty">No leave requests found.</div>
            ) : (
              <div className="leave-table-wrapper">
                <table className="leave-table">
                  <thead>
                    <tr>
                      <th>Leave ID</th>
                      <th>Type</th>
                      <th>Duration</th>
                      <th>Days</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Approved By / Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((req) => (
                      <tr key={req.id || req.leaveId}>
                        <td>#{req.leaveId || req.id}</td>
                        <td>{req.leaveType}</td>
                        <td>{req.startDate} to {req.endDate}</td>
                        <td>{req.totalDays}</td>
                        <td>{req.reason}</td>
                        <td>
                          <span className={`status-badge ${(req.status || "Pending").toLowerCase()}`}>
                            {req.status || "Pending"}
                          </span>
                        </td>
                        <td>
                          {req.status !== "Pending" ? (
                            <div>
                              <strong>{req.approvedBy}</strong> ({req.approvalDate})
                              <p className="mgr-comment">"{req.comments}"</p>
                            </div>
                          ) : (
                            <span className="text-muted">Awaiting Review</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Admin View - Manage Leaves */
        <div className="leave-admin-panel">
          <h2>Leave Requests Management</h2>
          {filteredRequests.length === 0 ? (
            <div className="empty">No leave requests in the system.</div>
          ) : (
            <div className="leave-table-wrapper">
              <table className="leave-table">
                <thead>
                  <tr>
                    <th>Leave ID</th>
                    <th>Employee Name</th>
                    <th>Leave Type</th>
                    <th>Duration</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => (
                    <tr key={req.id || req.leaveId}>
                      <td>#{req.leaveId || req.id}</td>
                      <td><strong>{req.employeeName}</strong></td>
                      <td>{req.leaveType}</td>
                      <td>{req.startDate} to {req.endDate}</td>
                      <td>{req.totalDays}</td>
                      <td>{req.reason}</td>
                      <td>{req.appliedDate}</td>
                      <td>
                        <span className={`status-badge ${(req.status || "Pending").toLowerCase()}`}>
                          {req.status || "Pending"}
                        </span>
                      </td>
                      <td>
                        {(req.status || "Pending") === "Pending" ? (
                          reviewingId === (req.id || req.leaveId) ? (
                            <form onSubmit={handleReviewSubmit} className="review-inline-form">
                              <input
                                type="text"
                                placeholder="Enter comments"
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                required
                              />
                              <div className="review-actions">
                                <button type="submit" className="save-btn-small">
                                  Confirm {actionType}
                                </button>
                                <button
                                  type="button"
                                  className="cancel-btn-small"
                                  onClick={() => setReviewingId(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <div className="actions-cell">
                              <button
                                className="approve-action-btn"
                                onClick={() => {
                                  setReviewingId(req.id || req.leaveId);
                                  setActionType("Approved");
                                }}
                              >
                                Approve
                              </button>
                              <button
                                className="reject-action-btn"
                                onClick={() => {
                                  setReviewingId(req.id || req.leaveId);
                                  setActionType("Rejected");
                                }}
                              >
                                Reject
                              </button>
                            </div>
                          )
                        ) : (
                          <div>
                            <strong>{req.approvedBy}</strong> ({req.approvalDate})
                            <p className="mgr-comment">"{req.comments}"</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LeaveRequests;
