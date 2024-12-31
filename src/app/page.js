import JewelryUploadPage from "../components/features/jewelry-upload";
import AdminDashboard from "../components/admin-dashboard";

export default function Home() {
  return (
    <>
      <AdminDashboard>
        {/* <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Total Orders</h2>
            <p className="text-3xl font-bold">1,234</p>
          </div>
        </div> */}
          <JewelryUploadPage />
      </AdminDashboard>
    </>
  );
}
