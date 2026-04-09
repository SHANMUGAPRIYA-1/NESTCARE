import { useState } from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBRadio
} from 'mdb-react-ui-kit';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    age: '',
    password: '',
    confirmPassword: '',
    deliveryType: '',
    babyArrival: '',
    babyDOB: null,
    mobileNo: ''
  });

  const [formErrors, setFormErrors] = useState({
    confirmPassword: ''
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
    if (formData.password !== formData.confirmPassword) {
      setFormErrors({ confirmPassword: "Passwords do not match" });
      return;
    }
    setFormErrors({ confirmPassword: '' });

    try {
      const response = await fetch('http://localhost:5001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Form data:', formData);
        navigate('/'); // Updated navigation
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        alert('An error occurred during registration.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during registration.');
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url('src/assets/register.png')`,
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '1550px',
      }}
    >
      <MDBContainer>
        <MDBRow className='justify-content-end align-items-center'>
          <MDBCol md='8' lg='6' xl='5' className='ms-lg-auto'>
            <MDBCard style={{ width: '100%' }}>
              <MDBCardBody className='px-4'>
                <h3 className="fw-bold mb-4 pb-2 pb-md-0 mb-md-5">Registration Form</h3>
                <form onSubmit={handleSubmit}>
                  <MDBRow>
                    <MDBCol md='12'>
                      <MDBInput
                        wrapperClass='mb-4'
                        label='Email'
                        size='lg'
                        id='email'
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </MDBCol>
                  </MDBRow>

                  <MDBRow>
                    <MDBCol md='6'>
                      <MDBInput
                        wrapperClass='mb-4'
                        label='Name'
                        size='lg'
                        id='name'
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </MDBCol>
                    <MDBCol md='6'>
                      <MDBInput
                        wrapperClass='mb-4'
                        label='Age'
                        size='lg'
                        id='age'
                        type='number'
                        name='age'
                        min='0'
                        value={formData.age}
                        onChange={handleChange}
                        required
                      />
                    </MDBCol>
                  </MDBRow>

                  <MDBRow>
                    <MDBCol md='6'>
                      <MDBInput
                        wrapperClass='mb-4'
                        label='Password'
                        size='lg'
                        id='password'
                        type='password'
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </MDBCol>
                    <MDBCol md='6'>
                      <MDBInput
                        wrapperClass='mb-4'
                        label='Confirm Password'
                        size='lg'
                        id='confirmPassword'
                        type='password'
                        name='confirmPassword'
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        onBlur={() => {
                          if (formData.password !== formData.confirmPassword) {
                            setFormErrors({ confirmPassword: "Passwords do not match" });
                          } else {
                            setFormErrors({ confirmPassword: '' });
                          }
                        }}
                      />
                      {formErrors.confirmPassword && (
                        <div className="text-danger">{formErrors.confirmPassword}</div>
                      )}
                    </MDBCol>
                  </MDBRow>

                  <MDBRow>
                    <MDBCol md='6'>
                      <h6 className="fw-bold mb-2">Delivery Type: </h6>
                      <MDBRadio
                        name='deliveryType'
                        id='deliveryNormal'
                        value='Normal'
                        label='Normal'
                        inline
                        onChange={handleChange}
                        checked={formData.deliveryType === 'Normal'}
                      />
                      <MDBRadio
                        name='deliveryType'
                        id='deliveryCSection'
                        value='C-Section'
                        label='C-Section'
                        inline
                        onChange={handleChange}
                        checked={formData.deliveryType === 'C-Section'}
                      />
                    </MDBCol>
                    <MDBCol md='6'>
                      <h6 className="fw-bold mb-2">Baby Arrival: </h6>
                      <MDBRadio
                        name='babyArrival'
                        id='babyArrivalYes'
                        value='Yes'
                        label='Yes'
                        inline
                        onChange={handleChange}
                        checked={formData.babyArrival === 'Yes'}
                      />
                      <MDBRadio
                        name='babyArrival'
                        id='babyArrivalNo'
                        value='No'
                        label='No'
                        inline
                        onChange={handleChange}
                        checked={formData.babyArrival === 'No'}
                      />
                    </MDBCol>
                  </MDBRow>

                  <MDBRow>
                    <MDBCol md='12'>
                      <h6 className="fw-bold mb-2">Baby DOB: </h6>
                      <DatePicker
                        selected={formData.babyDOB}
                        onChange={handleDateChange}
                        dateFormat='dd/MM/yyyy'
                        maxDate={new Date()}
                        isClearable
                        className='form-control mb-4'
                        placeholderText='Select Date of Birth'
                      />
                    </MDBCol>
                  </MDBRow>

                  <MDBRow>
                    <MDBCol md='12'>
                      <MDBInput
                        wrapperClass='mb-4'
                        label='Mobile Number'
                        size='lg'
                        id='mobileNo'
                        type='number'
                        name='mobileNo'
                        value={formData.mobileNo}
                        onChange={handleChange}
                        required
                      />
                    </MDBCol>
                  </MDBRow>

                  <div className="text-center">
                    <MDBBtn className='mb-4' size='lg' type='submit'>Submit</MDBBtn>
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
