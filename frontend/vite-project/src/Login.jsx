/* eslint-disable react/prop-types */
// Login.jsx

import  { useState } from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import logo from './assets/logo.jpg';
import cover from './assets/cover.jpg';
import { useNavigate, Link } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput
} from 'mdb-react-ui-kit';

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (data.status) {
        // Save user details in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        onLoginSuccess();
        navigate('/main');
      } else {
        alert('Invalid email or password');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during login.');
    }
  };

  return (
    <div style={{ backgroundColor: '#9A616D', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' ,marginTop:'1px'}}>
      <MDBContainer className="my-5">
        <MDBCard style={{ width: '100%', height: '650px', maxWidth: '90%', borderRadius: '15px', overflow: 'hidden' }}>
          <MDBRow className='g-0'>
            <MDBCol md='6'>
            <MDBCardImage src={cover} alt="login form" className='rounded-start w-100' style={{ height: '80%'}} />            </MDBCol>
            <MDBCol md='6'>
              <MDBCardBody className='d-flex flex-column'>
                <div className='d-flex flex-row mt-2'>
                <img src={logo} alt="Logo" style={{ height: '40px', width: 'auto', marginRight: '1rem' }} />                  <span className="h1 fw-bold mb-0">NestCare+</span>
                </div>
                <h5 className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>Sign into your account</h5>
                <form onSubmit={handleSubmit}>
                  <MDBInput wrapperClass='mb-4' label='Email address' id='formControlLg' type='email' size="lg" required
                    name='email'
                    value={loginData.email}
                    onChange={handleChange} />
                  <MDBInput wrapperClass='mb-1' label='Password' id='formControlLg' type='password' size="lg" required
                    name='password'
                    value={loginData.password}
                    onChange={handleChange} />
                  <MDBBtn className="mb-1 px-5" color='dark' size='lg' type='submit'>Login</MDBBtn>
                </form>
                <a className="small text-muted" href="#!">Forgot password?</a>
                <p className="mb-1 pb-lg-2" style={{ color: '#393f81' }}>Do not have an account? <Link to="/register" style={{ color: '#393f81' }}>Register here</Link></p>
                <div className='d-flex flex-row justify-content-start'>
                  <a href="#!" className="small text-muted me-1">Terms of use.</a>
                  <a href="#!" className="small text-muted">Privacy policy</a>
                </div>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBContainer>
    </div>
  );
}

export default Login;
