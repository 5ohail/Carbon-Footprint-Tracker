"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { initializeApp } from "firebase/app"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    maxWidth: "400px",
    margin: "0 auto",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    color: "#0066cc",
  },
  tabs: {
    display: "flex",
    width: "100%",
    marginBottom: "2rem",
  },
  tab: {
    flex: 1,
    padding: "0.75rem",
    textAlign: "center",
    cursor: "pointer",
    borderBottom: "2px solid #eaeaea",
    transition: "all 0.3s ease",
  },
  activeTab: {
    borderBottom: "2px solid #0066cc",
    fontWeight: "bold",
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "1rem",
  },
  button: {
    padding: "0.75rem",
    borderRadius: "4px",
    border: "none",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  primaryButton: {
    backgroundColor: "#0066cc",
    color: "white",
  },
  googleButton: {
    backgroundColor: "white",
    color: "#333",
    border: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    margin: "1rem 0",
    color: "#666",
  },
  line: {
    flex: 1,
    height: "1px",
    backgroundColor: "#eaeaea",
  },
  dividerText: {
    padding: "0 1rem",
    fontSize: "0.875rem",
  },
  error: {
    color: "#e74c3c",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
  },
  success: {
    color: "#2ecc71",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
  },
  forgotPassword: {
    fontSize: "0.875rem",
    color: "#0066cc",
    textAlign: "right",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
}

export function AuthPage({ onLoginSuccess }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setUsername("")
    setError("")
    setSuccess("")
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    resetForm()
  }

  const handleEmailSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!email || !password) {
        throw new Error("Please fill in all fields")
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || email.split("@")[0],
      }

      localStorage.setItem("user", JSON.stringify(userData))
      setSuccess("Successfully logged in!")
      toast.success("Successfully logged in!")

      if (onLoginSuccess) {
        onLoginSuccess(userData)
      } else {
        setTimeout(() => {
          navigate("/")
        }, 1000)
      }
    } catch (error) {
      console.error("Error signing in:", error)
      setError(error.message)
      toast.error("Invalid Crdentials") // Show error toast
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!email || !password || !username) {
        throw new Error("Please fill in all fields")
      }

      if (password.length < 6) {
        throw new Error("Password should be at least 6 characters")
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      await updateProfile(userCredential.user, {
        displayName: username,
      })

      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: username,
      }

      localStorage.setItem("user", JSON.stringify(userData))
      setSuccess("Account created successfully!")
      toast.success("Account created successfully!")

      if (onLoginSuccess) {
        onLoginSuccess(userData)
      } else {
        setTimeout(() => {
          navigate("/")
        }, 1000)
      }
    } catch (error) {
      console.error("Error signing up:", error)
      setError(error.message)
      toast.error("Can not Register the User") // Show error toast
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError("")

    try {
      const result = await signInWithPopup(auth, googleProvider)

      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
      }

      localStorage.setItem("user", JSON.stringify(userData))
      setSuccess("Successfully logged in with Google!")
      toast.success("Successfully logged in with Google!")

      if (onLoginSuccess) {
        onLoginSuccess(userData)
      } else {
        setTimeout(() => {
          navigate("/")
        }, 1000)
      }
    } catch (error) {
      console.error("Error signing in with Google:", error)
      setError(error.message)
      toast.error("Error Siging In") // Show error toast
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>D-CFT</h1>

      <div style={styles.tabs}>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === "login" ? styles.activeTab : {}),
          }}
          onClick={() => handleTabChange("login")}
        >
          Login
        </div>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === "signup" ? styles.activeTab : {}),
          }}
          onClick={() => handleTabChange("signup")}
        >
          Sign Up
        </div>
      </div>

      {activeTab === "login" ? (
        <form style={styles.form} onSubmit={handleEmailSignIn}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <div style={styles.forgotPassword}>Forgot password?</div>
          </div>

          <button type="submit" style={{ ...styles.button, ...styles.primaryButton }} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <div style={styles.divider}>
            <div style={styles.line}></div>
            <div style={styles.dividerText}>OR</div>
            <div style={styles.line}></div>
          </div>

          <button
            type="button"
            style={styles.googleButton}
            className="py-3 px-4 cursor-pointer"
            onClick={handleGoogleSignIn}
          >
            {console.log(GoogleIcon())}
           {GoogleIcon()} Sign in with Google
          </button>
        </form>
      ) : (
        <form style={styles.form} onSubmit={handleEmailSignUp}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your Name"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" style={{ ...styles.button, ...styles.primaryButton }} disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
      )}

      

      <ToastContainer /> {/* Toast notifications container */}
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  )
}