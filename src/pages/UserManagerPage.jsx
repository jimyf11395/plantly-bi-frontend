import { useState, useEffect } from "react";
import axios from "axios";
import UserModal from "../components/UserModal";
import Cookies from "js-cookie"; // npm install js-cookie

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    username: "",
    role: "",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ===== Open modals =====
  const openModal = () => {
    setEditingUser(null);
    setNewUser({ email: "", password: "", username: "", role: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setNewUser({
      email: user.email,
      password: "",
      username: user.username || "",
      role: user.role || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // ===== Fetch users =====
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth`
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users");
    }
  };

  // ===== Handle input changes =====
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  // ===== Add or update user =====

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");

      let url, method;

      if (editingUser) {
        // Editing existing user - use PUT with user_id
        url = `${process.env.REACT_APP_API_BASE_URL}/api/auth/${editingUser.user_id}`;
        method = "put";
      } else {
        // Creating new user - use POST to register
        url = `${process.env.REACT_APP_API_BASE_URL}/api/auth/register`;
        method = "post";
      }

      await axios({
        method,
        url,
        data: newUser,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setError("");
      closeModal();
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to save user";
      setError(errorMessage);
    }
  };

  // ===== Delete user =====
  const handleDelete = async (user_id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/${user_id}`
      );
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user");
    }
  };

  return (
    <div className="user-manager">
      <h2>Manage Users</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    onClick={() => openEditModal(user)}
                    className="btn btn-small btn-edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.user_id)}
                    className="btn btn-small btn-delete"
                    style={{
                      backgroundColor: "#d9534f",
                      color: "white",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* ===== Add/Edit Modal ===== */}
      {isModalOpen && (
        <UserModal
          newUser={editingUser || newUser}
          handleInputChange={(e) => handleInputChange(e, !!editingUser)}
          handleSubmit={handleSubmit}
          closeModal={closeModal}
          isEditing={!!editingUser}
        />
      )}
      <br />
      <button onClick={openModal} className="btn">
        Add New User
      </button>
    </div>
  );
};

export default UserManager;
