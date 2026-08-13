import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout";
import { HomePage } from "./pages/HomePage";
import { StoryPage } from "./pages/StoryPage";
import { LocationPage } from "./pages/LocationPage";
import { SchedulePage } from "./pages/SchedulePage";
import { DressCodePage } from "./pages/DressCodePage";
import { GiftsPage as PublicGiftsPage } from "./pages/GiftsPage";
import { RsvpPage } from "./pages/RsvpPage";
import { GuestAuthProvider } from "./context/GuestAuthContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminLoginPage } from "./components/admin/AdminLoginPage";
import { ProtectedAdminRoute } from "./components/admin/ProtectedAdminRoute";
import { DashboardPage } from "./components/admin/DashboardPage";
import { SettingsPage } from "./components/admin/SettingsPage";
import { StoryItemsPage } from "./components/admin/StoryItemsPage";
import { ScheduleItemsPage } from "./components/admin/ScheduleItemsPage";
import { PhotosPage } from "./components/admin/PhotosPage";
import { GiftsPage as AdminGiftsPage } from "./components/admin/GiftsPage";
import { RsvpsPage } from "./components/admin/RsvpsPage";
import { GiftReservationsPage } from "./components/admin/GiftReservationsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <GuestAuthProvider>
              <PublicLayout />
            </GuestAuthProvider>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/historia" element={<StoryPage />} />
          <Route path="/local" element={<LocationPage />} />
          <Route path="/cronograma" element={<SchedulePage />} />
          <Route path="/dress-code" element={<DressCodePage />} />
          <Route path="/presentes" element={<PublicGiftsPage />} />
          <Route path="/rsvp" element={<RsvpPage />} />
        </Route>

        <Route
          path="/admin/*"
          element={
            <AdminAuthProvider>
              <Routes>
                <Route path="login" element={<AdminLoginPage />} />
                <Route
                  path=""
                  element={
                    <ProtectedAdminRoute>
                      <AdminLayout />
                    </ProtectedAdminRoute>
                  }
                >
                  <Route index element={<DashboardPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="story" element={<StoryItemsPage />} />
                  <Route path="schedule" element={<ScheduleItemsPage />} />
                  <Route path="photos" element={<PhotosPage />} />
                  <Route path="gifts" element={<AdminGiftsPage />} />
                  <Route path="rsvps" element={<RsvpsPage />} />
                  <Route
                    path="gift-reservations"
                    element={<GiftReservationsPage />}
                  />
                </Route>
              </Routes>
            </AdminAuthProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
