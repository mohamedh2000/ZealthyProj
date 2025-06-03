import React, { useState } from 'react';

const OnboardingWizard = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([
    'Step 1: Enter your email',
    'Step 2: Set your password',
    'Step 3: Complete onboarding'
  ]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail && !validateEmail(newEmail)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    // ... existing code ...
  };

  return (
    <div className="onboarding-wizard">
      <div className="stepper">
        {steps.map((step, index) => (
          <div key={index} className={`step ${currentStep >= index ? 'active' : ''}`}>
            {index + 1}
          </div>
        ))}
      </div>

      {currentStep === 0 && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
            {emailError && <span className="error">{emailError}</span>}
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Next</button>
        </form>
      )}
    </div>
  );
};

export default OnboardingWizard; 