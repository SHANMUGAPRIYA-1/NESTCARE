import { useState } from "react";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBRadio,
} from "mdb-react-ui-kit";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    age: "",
    password: "",
    confirmPassword: "",
    deliveryType: "",
    babyArrival: "",
    babyDOB: null,
  });

  const [formErrors, setFormErrors] = useState({
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, babyDOB: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setFormErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setFormErrors({ confirmPassword: "" });

    // Format date before sending
    const formattedData = {
      ...formData,
      babyDOB: formData.babyDOB ? formData.babyDOB.toISOString() : null,
    };

    try {
      const response = await fetch("http://localhost:5001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user data to localStorage (for Profile page)
        localStorage.setItem(
          "user",
          JSON.stringify(data.user || formattedData),
        );

        alert("Registration Successful ✅");
        navigate("/");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url('src/assets/register.png')`,
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
      }}
    >
      <MDBContainer>
        <MDBRow className="justify-content-end align-items-center">
          <MDBCol md="8" lg="6" xl="5" className="ms-lg-auto">
            <MDBCard>
              <MDBCardBody className="px-4">
                <h3 className="fw-bold mb-4">Registration Form</h3>

                <form onSubmit={handleSubmit}>
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Email"
                    size="lg"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                  <MDBRow>
                    <MDBCol md="6">
                      <MDBInput
                        wrapperClass="mb-4"
                        label="Name"
                        size="lg"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </MDBCol>

                    <MDBCol md="6">
                      <MDBInput
                        wrapperClass="mb-4"
                        label="Age"
                        size="lg"
                        type="number"
                        name="age"
                        min="0"
                        value={formData.age}
                        onChange={handleChange}
                        required
                      />
                    </MDBCol>
                  </MDBRow>

                  <MDBRow>
                    <MDBCol md="6">
                      <MDBInput
                        wrapperClass="mb-4"
                        label="Password"
                        size="lg"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </MDBCol>

                    <MDBCol md="6">
                      <MDBInput
                        wrapperClass="mb-4"
                        label="Confirm Password"
                        size="lg"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      {formErrors.confirmPassword && (
                        <div className="text-danger">
                          {formErrors.confirmPassword}
                        </div>
                      )}
                    </MDBCol>
                  </MDBRow>

                  <MDBRow className="mb-3">
                    <MDBCol md="6">
                      <h6>Delivery Type:</h6>
                      <MDBRadio
                        name="deliveryType"
                        value="Normal"
                        label="Normal"
                        inline
                        onChange={handleChange}
                        checked={formData.deliveryType === "Normal"}
                      />
                      <MDBRadio
                        name="deliveryType"
                        value="C-Section"
                        label="C-Section"
                        inline
                        onChange={handleChange}
                        checked={formData.deliveryType === "C-Section"}
                      />
                    </MDBCol>

                    <MDBCol md="6">
                      <h6>Baby Arrival:</h6>
                      <MDBRadio
                        name="babyArrival"
                        value="Yes"
                        label="Yes"
                        inline
                        onChange={handleChange}
                        checked={formData.babyArrival === "Yes"}
                      />
                      <MDBRadio
                        name="babyArrival"
                        value="No"
                        label="No"
                        inline
                        onChange={handleChange}
                        checked={formData.babyArrival === "No"}
                      />
                    </MDBCol>
                  </MDBRow>

                  <h6>Baby DOB:</h6>
                  <DatePicker
                    selected={formData.babyDOB}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    maxDate={new Date()}
                    isClearable
                    className="form-control mb-4"
                    placeholderText="Select Date of Birth"
                  />

                  <div className="text-center">
                    <MDBBtn size="lg" type="submit">
                      Submit
                    </MDBBtn>
                  </div>
                </form>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Register;
