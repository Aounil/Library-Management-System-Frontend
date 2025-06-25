import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './T.css';
import { useContext } from "react";
import { UserContext } from "./UserContext";
import { jwtDecode } from "jwt-decode"; 


export default function Hello() {
  //hna dok values lli drti f usercontext
  const { setName } = useContext(UserContext)





  const navigate = useNavigate();
  const [isUser, setIsuser] = useState(false);

  // Handle form submission
  const handleUser = (e) => {
    e.preventDefault(); // Prevent page refresh
    setIsuser((prevState) => !prevState);
  };

  // Handle form data submission for registration
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const form = e.target;
    const formData = new FormData(form);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: formData.get('role'),
    };

    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set Content-Type to JSON
        },
        body: JSON.stringify(payload), // Send data as JSON
      });

      const data = await response.json();
      console.log('Response:', data);
      if (response.ok) {
        // Handle successful registration
        localStorage.setItem('authToken', data.token);
        console.log('User registered successfully');
        getname(data.token);
        navigate('/Books')
        handleUser(e); // Switch back to login state

      } else {
        console.log('Error:', data);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  // Handle form data submission for authentication/login
  const handleSubmit2 = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const form = e.target;
    const formData = new FormData(form);
    const payload = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set Content-Type to JSON

        },
        body: JSON.stringify(payload), // Send data as JSON
      });

      const data = await response.json();
      console.log('Response:', data);

      if (response.ok) {
        // Store the token in localStorage
        localStorage.setItem('authToken', data.token);
        getname(data.token);
        console.log('User authenticated successfully');
        navigate('/Books');
        setIsuser(false); // Switch back to sign-up state (you can redirect to another page here)
      } else {
        console.log('Error:', data);
      }
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };


  const getname = (token) => {
    const decoded_token = jwtDecode(token);
    const name = decoded_token.name; // This must match your backend JWT
    // localStorage.setItem("name", name); // persist it
    setName(name); // update context
  };
  

  return (
    <>


      <div className='container'>
        {isUser ? (
          <div className="container login">
            <h1 className='text-center'>Login</h1>
            <form onSubmit={handleSubmit2} className="container mt-4">
              <div className="mb-3">
                <input type="email" className="form-control" placeholder="Enter email" name="email" required />
              </div>
              <div className="mb-3">
                <input type="password" className="form-control" placeholder="Enter password" name="password" required />
              </div>
              <div className="d-flex gap-5 justify-content-center">
                <button className="btn btn-primary" onClick={handleUser}>Become a member</button>
                <button className="btn btn-success" type="submit">Submit</button>
              </div>
            </form>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="container sign">
            <h1 className="mb-4 text-center">Sign Up</h1>

            <div className="mb-3">
              <input type="text" className="form-control" placeholder="Nom" name="name" required />
            </div>

            <div className="mb-3">
              <input type="email" className="form-control" placeholder="Email" name="email" required />
            </div>

            <div className="mb-3">
              <input type="password" className="form-control" placeholder="Password" name="password" required />
            </div>

            <div className="mb-3">
              <select name="role" className="form-select">
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div className="d-flex justify-content-center gap-5">
              <button className="btn btn-primary" onClick={handleUser}>Already a member</button>
              <button className="btn btn-success" type="submit">Submit</button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
