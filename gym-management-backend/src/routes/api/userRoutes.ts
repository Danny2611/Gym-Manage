import express from 'express';
import { authenticateJWT } from '~/middlewares/auth';
import { createMoMoPayment, momoIpnCallback, momoRedirectCallback, getPaymentById, getPaymentStatus  } from '~/controllers/user/paymentController';
import {
  getCurrentProfile,
  updateProfile,
  updateAvatar,
  updateEmail,
  getMemberById,
  deactivateAccount
} from '~/controllers/user/memberController';

import {getMemberships, getMembershipById, pauseMembership, resumeMembership, getMembershipsActive, getMemberTrainingLocations} from '~/controllers/user/membershipController'
import { memberUpdateValidationRules } from '~/utils/validators/memberValidator';
import {  registerPackage } from '~/controllers/user/packageController';
import {  getInforMembershipDetails } from '~/controllers/user/membershipController';
import { createAppointment, getAllMemberAppointments, cancelAppointment, checkTrainerAvailability, 
  getMemberSchedule, rescheduleAppointment,getAppointmentById, completeAppointment, getUpcomingAppointments } 
from '~/controllers/user/appointmentController';
import { getAllMemberTransactions, getTransactionById, getRecentSuccessfulTransactions } from '~/controllers/user/transactionController';
import { getWorkoutSuggestions,getWorkoutScheduleById,updateWorkoutScheduleStatus, getMemberWorkoutSchedules,createWorkoutSchedule, getWeeklyWorkoutStats,
  getMonthComparisonStats,getLast7DaysWorkouts, getUpcomingWorkouts } from '~/controllers/user/workoutController';
import { workoutScheduleValidator, updateWorkoutScheduleStatusValidator,workoutSuggestionValidator } from '~/utils/validators/workoutValidator';
import {
  getLatestBodyMetrics,
  getInitialBodyMetrics,
  getPreviousMonthBodyMetrics,
  getBodyMetricsComparison,
  updateBodyMetrics,
  getBodyStatsProgressByMonth,
  getFitnessRadarData,
  calculateBodyMetricsChange,
  getFormattedMonthlyBodyMetrics
} from '~/controllers/user/progressController';
import { bodyMetricsValidationRules } from '~/utils/validators/progressValidator';

const router = express.Router();

//momo
router.get('/payment/momo/callback', momoRedirectCallback);// Route redirect từ MoMo sau khi thanh toán
router.post('/momo/ipn', momoIpnCallback);// Route callback từ MoMo (IPN)

router.use(authenticateJWT);// All these routes require authentication

// Member profile routes
router.get('/profile', getCurrentProfile);
router.put('/profile', memberUpdateValidationRules(), updateProfile);
router.put('/profile/avatar', updateAvatar);
router.put('/profile/email', updateEmail);
router.post('/deactivate', deactivateAccount);

// membership Routes
router.get('/training-locations', getMemberTrainingLocations);
router.post('/packages/register', registerPackage);
router.get('/my-package', getMemberships);
router.get('/my-package-active', getMembershipsActive);
router.post('/my-package/detail', getMembershipById);
router.patch('/my-package/pause', pauseMembership);
router.patch('/my-package/resume', resumeMembership);
router.get('/my-package/infor-membership', getInforMembershipDetails);

// Route lịch hẹn
router.get('/appointments/next-week', getUpcomingAppointments);
router.post('/appointments', createAppointment); // Tạo lịch hẹn
router.get('/my-schedule', getMemberSchedule);// Lấy danh sách lịch hẹn đã xác nhận của hội viên
router.get('/appointments', getAllMemberAppointments); // Lấy danh sách lịch hẹn của hội viên
router.get('/appointments/:appointmentId', getAppointmentById); // Lấy danh sách lịch hẹn của hội viên
router.delete('/:appointmentId/cancel', cancelAppointment); // Hủy lịch hẹn
router.put('/:appointmentId/complete', completeAppointment);
router.put('/:appointmentId/reschedule', rescheduleAppointment); // Đổi lịch hẹn
router.post('/appointments/check-availability', checkTrainerAvailability); // Kiểm tra lịch trống của huấn luyện viên

//lịch tập cá nhân
router.post(
  '/workout/suggestions', workoutSuggestionValidator, getWorkoutSuggestions);// Lấy gợi ý bài tập
router.post(
  '/workout/schedules',workoutScheduleValidator,createWorkoutSchedule);// Tạo lịch tập cá nhân
router.get('/workout/schedules', getMemberWorkoutSchedules);// Lấy danh sách lịch tập
router.get('/workout/schedules/:scheduleId', getWorkoutScheduleById);// Lấy chi tiết lịch tập
router.patch(
  '/workout/schedules/:scheduleId/status',
  updateWorkoutScheduleStatusValidator, updateWorkoutScheduleStatus);

router.get('/workout/weekly', getWeeklyWorkoutStats);
router.get('/workout/monthly-comparison', getMonthComparisonStats);
router.get('/workout/last-7-days', getLast7DaysWorkouts);
router.get('/workout/next-week', getUpcomingWorkouts);






// Progress Tracking Routes
router.get('/progress/metrics/latest', getLatestBodyMetrics); // Lấy chỉ số cơ thể mới nhất
router.get('/progress/metrics/initial', getInitialBodyMetrics); // Lấy chỉ số cơ thể ban đầu
router.get('/progress/metrics/previous-month', getPreviousMonthBodyMetrics); // Lấy chỉ số cơ thể tháng trước
router.get('/progress/metrics/comparison', getBodyMetricsComparison); // Lấy so sánh chỉ số cơ thể
router.post('/progress/metrics', bodyMetricsValidationRules(), updateBodyMetrics); // Cập nhật chỉ số cơ thể
router.get('/progress/stats/monthly', getBodyStatsProgressByMonth); // Lấy tiến độ chỉ số cơ thể theo tháng
router.get('/progress/radar', getFitnessRadarData); // Lấy dữ liệu radar thể lực
router.get('/progress/metrics/changes', calculateBodyMetricsChange); // Tính toán thay đổi chỉ số cơ thể
router.get('/progress/monthly-body-metrics', getFormattedMonthlyBodyMetrics);

  
// transaction
router.get('/transactions', getAllMemberTransactions); // lấy danh sách giao dịch
router.post('/transaction-details', getTransactionById) // lấy giao dịch  details
router.get('/transaction/success', getRecentSuccessfulTransactions) // lấy giao dịch  details


// Payment routes
router.post('/momo/create',createMoMoPayment);// Route tạo thanh toán MoMo
router.get('/payments/:paymentId/status',  getPaymentStatus);// Kiểm tra trạng thái thanh toán (cho frontend polling)
router.get('/:paymentId',getPaymentById);// Route lấy thông tin thanh toán




export default router;