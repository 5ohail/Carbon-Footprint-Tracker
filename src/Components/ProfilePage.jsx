import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthPage } from "../Components/AuthPage.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getAuth,
  onAuthStateChanged,
  deleteUser,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
} from "firebase/auth";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useData } from "../utils/DataProvider"; // adjust path

const styles = {
  container: {
    maxWidth: "60rem",
    margin: "0 auto",
  },
  header: {
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#0066cc",
  },
  subtitle: {
    color: "#666",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "2rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: "2rem",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#0066cc",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  email: {
    color: "#666",
  },
  profileInfo: {
    display: "grid",
    gap: "1.5rem",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#666",
  },
  value: {
    fontSize: "1rem",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "1rem",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "1.5rem",
  },
  button: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#0066cc",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
  },
  secondaryButton: {
    backgroundColor: "white",
    color: "#0066cc",
    border: "1px solid #ddd",
  },
  dangerButton: {
    backgroundColor: "#e74c3c",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    marginTop: "1rem",
  },
  statCard: {
    backgroundColor: "#f9fafb",
    padding: "1.5rem",
    borderRadius: "8px",
    textAlign: "center",
  },
  statValue: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#0066cc",
    marginBottom: "0.5rem",
  },
  statLabel: {
    fontSize: "0.875rem",
    color: "#666",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "1rem",
    marginTop: "2rem",
  },
  tabGroup: {
    display: "flex",
    borderBottom: "1px solid #eaeaea",
    marginBottom: "1.5rem",
  },
  tab: {
    padding: "0.75rem 1.5rem",
    cursor: "pointer",
    borderBottom: "2px solid transparent",
  },
  activeTab: {
    borderBottom: "2px solid #0066cc",
    fontWeight: "500",
    color: "#0066cc",
  },
};
const graphSampleData = [
  { name: "Jan", emissions: 200 },
  { name: "Feb", emissions: 180 },
  { name: "Mar", emissions: 220 },
  { name: "Apr", emissions: 160 },
  { name: "May", emissions: 190 },
  { name: "Jun", emissions: 170 },
];
const auth = getAuth();


export function ProfilePage() {
  const navigate  = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [creationDate, setCreationDate] = useState(null);
  const { graphData,setGraphData , data, setData} = useData();

  // WAIT USER TO LOAD
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setCreationDate(
        new Date(user.metadata.creationTime).toDateString()
      );
    }
  });

  return () => unsubscribe();
}, []);


  // TOTAL EMISSIONS FUNCTIONALITY
  const totalEmissions = ()=>{
    let total = 0;
     data ? Object.values(data).map((e)=>{
      return total += e.emission;
     }) : 0;
     return total;
   }
   // CALCULATING THE REDUCTION GOALS
   const calculateReductionGoal = () => {
    const updatedData = graphData.map((entry) => {
      const reductionGoal = entry.emissions - entry.emissions * 0.1; // 10% reduction
      return {
        ...entry,
        reductionGoal: parseFloat(reductionGoal.toFixed(2)),
      };
    });
    let total = 0
    updatedData.map((entry) => {
      total += entry.reductionGoal
      return total
    })
    const reductionGoal = total / updatedData.length
    
    return reductionGoal; // returns full array with reductionGoal added
  };
  
  
  // REDUCTION DETECTING AI 
  const getTotalEmissionReduction = (data) => {
    const sorted = Object.values(data)
      .filter(item => item.emission !== undefined)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  
    let totalReduction = 0;
  
    for (let i = 1; i < sorted.length; i++) {
      const diff = sorted[i - 1].emission - sorted[i].emission;
      if (diff > 0) totalReduction += diff;
    }
  
    return totalReduction.toFixed(2); // in kg CO₂
  };
  
  //SETTING TAB FUNCTIONALITY
  const [settings, setSettings] = useState({
    emailNotifications: true,
    dataSharing: false,
  });
  const handleSettingsChange = (e) => {
    const { name, checked } = e.target;
    const updatedSettings = {
      ...settings,
      [name]: checked,
    };
    setSettings(updatedSettings);
    localStorage.setItem("settings", JSON.stringify(updatedSettings));
  };
  //DELETE USER
  const handleDeleteAccount = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      deleteUser(user)
        .then(() => {
          localStorage.removeItem("user");
          localStorage.removeItem("settings");
          alert("Account deleted successfully.");
          navigate("/"); // redirect to home or login
        })
        .catch((error) => {
          console.error("Delete failed:", error.message);
          if (error.code === "auth/requires-recent-login") {
            alert("Please re-login and try deleting again.");
          } else {
            alert("Failed to delete account.");
          }
        });
    }
  };

  //UPDATE PASSWORD
  const handlePasswordChange = async () => {
    setChangingPassword(true);
    const auth = getAuth();
    const user = auth.currentUser;

    const credential = EmailAuthProvider.credential(user.email, oldPassword);

    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      alert("Password updated successfully!");
      setShowPasswordModal(false);
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Password change error:", error.message);
      alert(error.message);
    } finally {
      setChangingPassword(false);
    }
  };

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setEditedUser(parsedUser);
    }
    setLoading(false);
    const storedSettings = localStorage.getItem("settings");
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);
  const Data = graphData || graphSampleData;

  //GUAGE CHART LOGIC
  const percentage = () => {
    const dataArray = graphData?.length ? graphData : graphSampleData;
    if (!dataArray || dataArray.length === 0) return 0;

    const total = dataArray.reduce(
      (acc, item) => acc + (item.emissions || 0),
      0
    );
    const avgEmissions = total / dataArray.length;

    const monthlyGoal = 200; // Change this as needed
    const percent = Math.round((avgEmissions / monthlyGoal) * 100);

    return Math.min(percent, 100); // Cap it at 100%
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setUser(null);
        setData({});
        setGraphData([]);
        localStorage.removeItem("user"); // Also remove user from localStorage
        toast.success("Logged out successfully"); // Fixed typo here
      })
      .catch((error) => {
        toast.error("Error logging out");
      });
  };
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditedUser(user);
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = () => {
    // Update user in localStorage
    localStorage.setItem("user", JSON.stringify(editedUser));
    setUser(editedUser);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };

  // If not logged in, show login page
  if (!loading && !user) {
    return <AuthPage />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  // Get initials for avatar
  const getInitials = () => {
    if (!user.displayName) return "U";
    return user.displayName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase();
  };

  
  return (
    <div style={styles.container}>
      
      <div style={styles.header}>
        <h1 style={styles.title}>Your Profile</h1>
        <p style={styles.subtitle}>
          Manage your account settings and preferences
        </p>
      </div>

      <div style={styles.tabGroup}>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === "profile" ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </div>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === "settings" ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </div>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === "activity" ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab("activity")}
        >
          Activity
        </div>
      </div>

      {activeTab === "profile" && (
        <>
          <div style={styles.card}>
            <div style={styles.profileHeader}>
              <div style={styles.avatar}>{getInitials()}</div>
              <div style={styles.userInfo}>
                <div style={styles.name}>{user.displayName || "User"}</div>
                <div style={styles.email}>{user.email}</div>
              </div>
            </div>

            {isEditing ? (
              <div style={styles.profileInfo}>
                <div style={styles.infoItem}>
                  <label style={styles.label}>Display Name</label>
                  <input
                    type="text"
                    name="displayName"
                    value={editedUser.displayName || ""}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.infoItem}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleInputChange}
                    style={styles.input}
                    disabled
                  />
                  <span style={{ fontSize: "0.75rem", color: "#666" }}>
                    Email cannot be changed
                  </span>
                </div>

                <div style={styles.buttonGroup}>
                  <button style={styles.button} onClick={handleSaveProfile}>
                    Save Changes
                  </button>
                  <button
                    style={{ ...styles.button, ...styles.secondaryButton }}
                    onClick={handleEditToggle}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={styles.profileInfo}>
                <div style={styles.infoItem}>
                  <div style={styles.label}>Display Name</div>
                  <div style={styles.value}>
                    {user.displayName || "Not set"}
                  </div>
                </div>

                <div style={styles.infoItem}>
                  <div style={styles.label}>Email</div>
                  <div style={styles.value}>{user.email}</div>
                </div>

                <div style={styles.infoItem}>
                  <div style={styles.label}>Account ID</div>
                  <div style={styles.value}>{user.uid}</div>
                </div>

                <div style={styles.buttonGroup}>
                  <button style={styles.button} onClick={handleEditToggle}>
                    Edit Profile
                  </button>
                  <button
                    style={{ ...styles.button, ...styles.dangerButton }}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                  <ToastContainer />
                </div>
              </div>
              
            )}
          </div>

          <h2 style={styles.sectionTitle}>Carbon Footprint Statistics</h2>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{totalEmissions()} kg</div>
              <div style={styles.statLabel}>CO2 Emissions Tracked</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{getTotalEmissionReduction(data)} kg</div>
              <div style={styles.statLabel}>CO2 Emissions Reduced</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>5</div>
              <div style={styles.statLabel}>Offset Projects Supported</div>
            </div>
          </div>
          {/* Circular Gauge */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "2rem",
            }}
          >
            <div style={{ width: 100, height: 100 }}>
              <CircularProgressbar
                value={calculateReductionGoal()}
                text={`${calculateReductionGoal()}%`}
                styles={buildStyles({
                  pathColor: "#0066cc",
                  textColor: "#0066cc",
                })}
              />
              <p
                style={{
                  textAlign: "center",
                  fontSize: "0.875rem",
                  color: "#666",
                }}
              >
                Reduction Goal
              </p>
            </div>
            <div style={{ width: 100, height: 100 }}>
              <CircularProgressbar
                value={percentage()}
                text={`${percentage()}%`}
                styles={buildStyles({
                  pathColor: "#e74c3c",
                  textColor: "#e74c3c",
                })}
              />
              <p
                style={{
                  textAlign: "center",
                  fontSize: "0.875rem",
                  color: "#666",
                }}
              >
                Current Impact
              </p>
            </div>
          </div>

          {/* Line Graph */}
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "1rem",
              marginTop: "2rem",
            }}
          >
            Monthly CO2 Emissions
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={Data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="emissions"
                stroke="#0066cc"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}

      {activeTab === "settings" && (
        <div style={styles.card}>
          <h2 style={{ marginBottom: "1.5rem" }}>Account Settings</h2>

          <div style={styles.profileInfo}>
            <div style={styles.infoItem}>
              <label style={styles.label}>Email Notifications</label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <input type="checkbox" id="emailNotifications" />
                <label htmlFor="emailNotifications">
                  Receive email notifications
                </label>
              </div>
            </div>

            <div style={styles.infoItem}>
              <label style={styles.label}>Data Privacy</label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <input type="checkbox" id="dataSharing" />
                <label htmlFor="dataSharing">
                  Allow anonymous data sharing for research
                </label>
              </div>
            </div>

            <div style={styles.infoItem}>
              <label style={styles.label}>Password</label>
              <button
                style={{
                  ...styles.button,
                  ...styles.secondaryButton,
                  marginTop: "0.5rem",
                }}
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </button>
            </div>

            <div style={styles.infoItem}>
              <label style={styles.label}>Delete Account</label>
              <button
                style={{
                  ...styles.button,
                  ...styles.dangerButton,
                  marginTop: "0.5rem",
                }}
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

{activeTab === "activity" && (
  <div style={styles.card}>
    <h2 style={{ marginBottom: "1.5rem" }}>Recent Activity</h2>

    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {Object.values(data).length > 0 ? (
  Object.values(data)
    .slice(-5)
    .reverse()
    .map((entry, index) => {
      return (
        <div
          key={index}
          style={{ padding: "1rem", borderBottom: "1px solid #eaeaea" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontWeight: "500" }}>
              Carbon Footprint Calculated
            </div>
            <div style={{ color: "#666", fontSize: "0.875rem" }}>
              {entry.date}
            </div>
          </div>
          <div style={{ color: "#666", marginTop: "0.5rem" }}>
            You calculated your carbon footprint: {entry.emission.toFixed(2)} kg CO₂e
          </div>
        </div>
      );
    })
)
 : (
        <div style={{ color: "#666" }}>No recent activity.</div>
      )}

      {/* Optional: Account creation info (static or from user data) */}
      <div style={{ padding: "1rem", borderBottom: "1px solid #eaeaea" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontWeight: "500" }}>Account Created</div>
          <div style={{ color: "#666", fontSize: "0.875rem" }}>
            {/* Replace with dynamic join date if available */}
            {creationDate ? creationDate : "Loading..."}
          </div>
        </div>
        <div style={{ color: "#666", marginTop: "0.5rem" }}>
          You created your Carbon Tracker account
        </div>
      </div>
    </div>
  </div>
)}


      {showPasswordModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "1rem",
              minWidth: "300px",
            }}
          >
            <h3 style={{ marginBottom: "1rem" }} className="text-gray-900">Change Password</h3>
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem",borderRadius: "0.3rem",border: "1px solid rgb(221, 221, 221)" }}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem", borderRadius: "0.3rem",border: "1px solid rgb(221, 221, 221)" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() => setShowPasswordModal(false)}
                disabled={changingPassword}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={changingPassword}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {changingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
