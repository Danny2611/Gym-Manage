import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ComponentCard from "~/components/dashboard/common/ComponentCard";
import Avatar from "~/components/dashboard/ui/avatar/Avatar";
import { membershipService } from "~/services/membershipService";
import { MembershipDetailsResponse } from "~/types/membership";
import { MembershipWithRemainingData } from "~/services/membershipService";
import MembershipDetailsModal from "~/components/user/memberships/MembershipDetailsModal";
import Spinner from "./Spinner";
import { paymentService } from "~/services/paymentService";
import { toast } from "sonner";
import { workoutService } from "~/services/workoutService";
import { appointmentService } from "~/services/appointmentService";
import { formatTime } from "~/utils/formatters";
import WeeklyWorkoutChart from "~/components/user/progresses/WeeklyWorkoutChart";


// Interface for combined upcoming schedule items
interface ScheduleItem {
  date: Date;
  timeStart: Date;
  timeEnd?: Date;
  location?: string;
  status: string;
  type: 'workout' | 'appointment';
  name?: string;
}

// Interface for Weekly Workout data
interface WeeklyWorkout {
  name: string;
  sessions: number;
  duration: number;
  target?: number;
}

// Badge component for statuses
const Badge = ({
  type,
  text,
}: {
  type: "success" | "warning" | "error" | "info";
  text: string;
}) => {
  const colorClasses = {
    success:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses[type]}`}
    >
      {text}
    </span>
  );
};

// Helper functions
const getPackageBadgeType = (
  category: string,
): "success" | "warning" | "error" | "info" => {
  switch (category.toLowerCase()) {
    case "premium":
    case "platinum":
    case "vip":
      return "success";
    case "fitness":
      return "info";
    case "basic":
      return "warning";
    default:
      return "info";
  }
};

const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const Dashboard: React.FC = () => {
  const [membershipDetails, setMembershipDetails] =
    useState<MembershipDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // State for membership modal
  const [selectedMembership, setSelectedMembership] =
    useState<MembershipWithRemainingData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  // State for combined upcoming schedule
  const [upcomingSchedule, setUpcomingSchedule] = useState<ScheduleItem[]>([]);
  
  // State for weekly workout data
  const [weeklyWorkoutData, setWeeklyWorkoutData] = useState<WeeklyWorkout[]>([
    { name: "T2", sessions: 0, duration: 0, target: 0 },
    { name: "T3", sessions: 0, duration: 0, target: 0 },
    { name: "T4", sessions: 0, duration: 0, target: 0 },
    { name: "T5", sessions: 0, duration: 0, target: 0 },
    { name: "T6", sessions: 0, duration: 0, target: 0 },
    { name: "T7", sessions: 0, duration: 0, target: 0 },
    { name: "CN", sessions: 0, duration: 0, target: 0 },
  ]);

  // Handle payment
  const handlePayment = async (packageId: string) => {
    try {
      // Step 1: Register for the package
      const registerResponse = await paymentService.registerPackage(packageId);

      if (!registerResponse.success) {
        alert(registerResponse.message || "Lỗi khi đăng ký gói tập");
        return;
      }

      // Step 2: Create MoMo payment request
      const paymentResponse = await paymentService.createMoMoPayment(packageId);

      if (!paymentResponse.success || !paymentResponse.data) {
        alert(paymentResponse.message || "Lỗi khi tạo yêu cầu thanh toán");
        return;
      }

      // Save payment info to localStorage for later use
      localStorage.setItem(
        "currentPayment",
        JSON.stringify({
          paymentId: paymentResponse.data.paymentId,
          transactionId: paymentResponse.data.transactionId,
          amount: paymentResponse.data.amount,
          expireTime: paymentResponse.data.expireTime,
          packageId: packageId,
        }),
      );

      // Redirect to MoMo payment page
      window.location.href = paymentResponse.data.payUrl;
    } catch (err) {
      console.error("Lỗi khi xử lý đăng ký:", err);
      alert("Đã xảy ra lỗi không mong muốn");
    }
  };

  // Handle pause membership
  const handlePauseMembership = async (id: string) => {
    try {
      const response = await membershipService.pauseMembership(id);
      if (response.success) {
        fetchData();
        alert("Tạm dừng gói tập thành công");
        setIsModalOpen(false);
      } else {
        alert(response.message || "Không thể tạm dừng gói tập");
      }
    } catch (error) {
      console.error("Lỗi khi tạm dừng gói tập:", error);
      alert("Đã xảy ra lỗi khi tạm dừng gói tập");
    }
  };

  // Handle resume membership
  const handleResumeMembership = async (id: string) => {
    try {
      const response = await membershipService.resumeMembership(id);
      if (response.success) {
        fetchData();
        alert("Tiếp tục gói tập thành công");
        setIsModalOpen(false);
      } else {
        alert(response.message || "Không thể tiếp tục gói tập");
      }
    } catch (error) {
      console.error("Lỗi khi tiếp tục gói tập:", error);
      alert("Đã xảy ra lỗi khi tiếp tục gói tập");
    }
  };

  // Handle view membership details
  const handleViewDetails = async (id: string) => {
    try {
      const response = await membershipService.getMembershipById(id);
      if (response.success && response.data) {
        setSelectedMembership(response.data);
        setIsModalOpen(true);
      } else {
        toast.error("Vui lòng đăng ký gói tập");
      }
    } catch (error) {
      console.error("Lỗi khi tải chi tiết gói tập:", error);
      alert("Đã xảy ra lỗi khi tải chi tiết gói tập");
    }
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Hôm nay";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Ngày mai";
    } else {
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  };

  // Get badge type based on status
  const getStatusBadgeType = (status: string): "success" | "warning" | "error" | "info" => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "đã xác nhận":
        return "success";
      case "pending":
      case "chờ xác nhận":
        return "info";
      case "cancelled":
      case "đã hủy":
        return "error";
      default:
        return "warning";
    }
  };

  // Format status for display
  const formatStatus = (status: string): string => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  // Load all necessary data
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch membership details
      const membershipResponse = await membershipService.getInforMembershipDetails();
     
      if (membershipResponse.success && membershipResponse.data) {
        setMembershipDetails(membershipResponse.data);
      } else {
        setError(membershipResponse.message || "Không thể tải thông tin hội viên");
      }

      // Fetch weekly workout data
      const weeklyStatsResponse = await workoutService.getWeeklyWorkoutStats();
      if (weeklyStatsResponse.success && weeklyStatsResponse.data) {
        setWeeklyWorkoutData(weeklyStatsResponse.data);
      }

      // Fetch upcoming workouts and appointments
      const upcomingWorkoutsData = await workoutService.getUpcomingWorkouts();
      const upcomingAppointmentData = await appointmentService.getUpcomingAppointment();
      
      // Process and combine workout and appointment data
      let combinedSchedule: ScheduleItem[] = [];
      
      // Process workouts data
      if (upcomingWorkoutsData.success && upcomingWorkoutsData.data) {
        const workouts = upcomingWorkoutsData.data.map(workout => ({
          ...workout,
          type: 'workout' as const,
          name: 'Cá nhân'
        }));
        combinedSchedule = [...combinedSchedule, ...workouts];
      }
      
      // Process appointments data
      if (upcomingAppointmentData.success && upcomingAppointmentData.data) {
        const appointments = upcomingAppointmentData.data.map(appointment => ({
          ...appointment,
          type: 'appointment' as const,
          name: 'Tập với PT'
        }));
        combinedSchedule = [...combinedSchedule, ...appointments];
      }
      
      // Sort by date and time
      combinedSchedule.sort((a, b) => {
        const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
        if (dateCompare !== 0) return dateCompare;
        return new Date(a.timeStart).getTime() - new Date(b.timeStart).getTime();
      });
      
      // Set combined schedule data
      setUpcomingSchedule(combinedSchedule);
      
    } catch (err) {
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Navigate to full schedule
  const goToFullSchedule = () => {
    navigate('/user/my-schedule');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
        Dashboard Hội Viên
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Thông tin tài khoản hội viên */}
        <ComponentCard title="Thông tin hội viên" className="lg:col-span-1">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <div className="rounded-md bg-red-50 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          ) : membershipDetails ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={
                      membershipDetails.member_avatar
                        ? `http://localhost:5000/${membershipDetails.member_avatar}`
                        : "/api/placeholder/400/400"
                    }
                    alt={membershipDetails.member_name}
                    name={membershipDetails.member_name}
                    size="xl"
                    className="border-2 border-blue-100"
                  />
                  <span className="font-medium">
                    {membershipDetails.member_name}
                  </span>
                </div>
                <Badge
                  type={getPackageBadgeType(membershipDetails.package_category)}
                  text={capitalizeFirstLetter(membershipDetails.package_category)}
                />
              </div>
              <div className="mt-2 space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Gói tập hiện tại:
                  </span>
                  <span className="font-medium">
                    {membershipDetails.package_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Thời hạn còn lại:
                  </span>
                  <span className="font-medium">
                    {membershipDetails.days_remaining} ngày
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Buổi tập còn lại:
                  </span>
                  <span className="font-medium">
                    {membershipDetails.sessions_remaining}/
                    {membershipDetails.total_sessions} buổi
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {membershipDetails.status === "null" ? (
                  <button
                    className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    onClick={() => navigate("/user/packages")}
                  >
                    Đăng ký gói tập
                  </button>
                ) : (
                  <button
                    className={`rounded-lg px-4 py-2 text-white ${membershipDetails.status === "expired" ? "bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-gray-400"}`}
                    disabled={membershipDetails.status !== "expired"}
                    onClick={() => handlePayment(membershipDetails.package_id)}
                  >
                    Gia hạn gói tập
                  </button>
                )}

                <button
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  onClick={() => handleViewDetails(membershipDetails.membership_id)}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-md bg-yellow-50 p-4 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
              Bạn chưa đăng ký gói tập nào
            </div>
          )}
        </ComponentCard>

        {/* Lịch tập sắp tới */}
        <ComponentCard
          title="Lịch tập sắp tới"
          className="lg:col-span-2"
          desc="Các buổi tập được lên lịch trong thời gian tới"
        >
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : upcomingSchedule.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {upcomingSchedule.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.name}</span>
                          <Badge
                            type={getStatusBadgeType(item.status)}
                            text={formatStatus(item.status)}
                          />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(new Date(item.date))} | {formatTime(new Date(item.timeStart))}
                          {item.timeEnd ? ` - ${formatTime(new Date(item.timeEnd))}` : ''}
                        </span>
                        {item.location && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Địa điểm: {item.location}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={goToFullSchedule}
                  className="rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                >
                  Xem tất cả
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center text-gray-500 dark:text-gray-400">
              Bạn chưa có lịch tập nào sắp tới
            </div>
          )}
        </ComponentCard>

        {/* Buổi tập trong tuần - Kết hợp từ ProgressPage */}
        <WeeklyWorkoutChart 
          weeklyWorkoutData={weeklyWorkoutData} 
          className="lg:col-span-3" 
        />
      </div>

      

      {/* Modal xem chi tiết */}
      {selectedMembership && (
        <MembershipDetailsModal
          membership={selectedMembership}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onPause={handlePauseMembership}
          onResume={handleResumeMembership}
        />
      )}
    </div>
  );
};

export default Dashboard;
