import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

const LOCAL_STORAGE_KEY = 'onboardingProgress';

const UserOnboarding = () => {
  // Try to load progress from localStorage
  const savedProgress = (() => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    } catch {
      return null;
    }
  })();

  const [currentStep, setCurrentStep] = useState(savedProgress?.currentStep || 1);
  const [formConfig, setFormConfig] = useState({
    page2: ['aboutMe', 'birthdate'],
    page3: ['address']
  });
  const [formData, setFormData] = useState(savedProgress?.formData || {
    email: '',
    password: '',
    aboutMe: '',
    streetAddress: '',
    city: '',
    state: '',
    zip: '',
    birthdate: ''
  });
  const [birthdateError, setBirthdateError] = useState('');
  const [aboutMeError, setAboutMeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [addressErrors, setAddressErrors] = useState({ streetAddress: '', city: '', state: '', zip: '' });

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/config`)
      .then(res => res.json())
      .then(data => {
        const config = {
          page2: Array.isArray(data.page2) ? data.page2 : [],
          page3: Array.isArray(data.page3) ? data.page3 : []
        };
        setFormConfig(config);
      })
      .catch(() => {});
  }, []);

  // Save progress to localStorage after Step 1 is completed
  useEffect(() => {
    if (formData.email && formData.password) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ currentStep, formData })
      );
    }
  }, [currentStep, formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'birthdate') setBirthdateError('');
    if (name === 'aboutMe') setAboutMeError('');
    if (name === 'email') setEmailError('');
    if (name === 'password') setPasswordError('');
    if (['streetAddress', 'city', 'state', 'zip'].includes(name)) {
      setAddressErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validation function for current step
  const validateCurrentStep = () => {
    let hasError = false;
    // Step 1 validation
    if (currentStep === 1) {
      if (!formData.email.trim()) {
        setEmailError('Email is required.');
        hasError = true;
      }
      if (!formData.password.trim()) {
        setPasswordError('Password is required.');
        hasError = true;
      }
    }
    // Step 2/3 validation
    const stepConfig = currentStep === 2 ? formConfig.page2 : currentStep === 3 ? formConfig.page3 : [];
    if (stepConfig.includes('birthdate') && !formData.birthdate) {
      setBirthdateError('Birthdate is required.');
      hasError = true;
    }
    if (stepConfig.includes('aboutMe') && !formData.aboutMe.trim()) {
      setAboutMeError('About Me is required.');
      hasError = true;
    }
    if (stepConfig.includes('address')) {
      let addrErrs = { streetAddress: '', city: '', state: '', zip: '' };
      if (!formData.streetAddress.trim()) {
        addrErrs.streetAddress = 'Street address is required.';
        hasError = true;
      }
      if (!formData.city.trim()) {
        addrErrs.city = 'City is required.';
        hasError = true;
      }
      if (!formData.state.trim()) {
        addrErrs.state = 'State is required.';
        hasError = true;
      }
      if (!formData.zip.trim()) {
        addrErrs.zip = 'ZIP code is required.';
        hasError = true;
      }
      setAddressErrors(addrErrs);
    }
    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;
    try {
      const transformedData = {
        email: formData.email,
        password: formData.password,
        about_me: formData.aboutMe || '',
        birthdate: formData.birthdate || null,
        street_address: formData.streetAddress || '',
        city: formData.city || '',
        state: formData.state || '',
        zip: formData.zip || '',
        current_step: currentStep
      };
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData),
      });
      if (response.ok) {
        alert('Thank you for submitting your information!');
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        navigate('/data');
      }
    } catch (error) {
      // handle error
    }
  };

  const hasRenderableFields = (fields) => {
    if (!fields || !Array.isArray(fields)) return false;
    return fields.some(f => ['aboutMe', 'birthdate', 'address'].includes(f));
  };

  const getNextStepWithFields = (step) => {
    let nextStep = step + 1;
    while (
      (nextStep === 2 && !hasRenderableFields(formConfig.page2)) ||
      (nextStep === 3 && !hasRenderableFields(formConfig.page3))
    ) {
      nextStep++;
    }
    return nextStep <= 3 ? nextStep : null;
  };

  const nextStepWithFields = getNextStepWithFields(currentStep);

  const handleNext = () => {
    setBirthdateError('');
    setAboutMeError('');
    setEmailError('');
    setPasswordError('');
    setAddressErrors({ streetAddress: '', city: '', state: '', zip: '' });
    if (!validateCurrentStep()) return;
    if (nextStepWithFields) {
      setCurrentStep(nextStepWithFields);
    }
  };

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Step 1: Account Information</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
            {emailError && (
              <div className="text-red-600 text-sm mt-1">{emailError}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
            {passwordError && (
              <div className="text-red-600 text-sm mt-1">{passwordError}</div>
            )}
          </div>
        </div>
      );
    }
    const stepConfig = currentStep === 2 ? formConfig.page2 : currentStep === 3 ? formConfig.page3 : [];
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Step {currentStep}: {currentStep === 2 ? 'Personal Information' : 'Additional Information'}</h2>
        {stepConfig.includes('aboutMe') && (
          <div>
            <label className="block text-sm font-medium text-gray-700">About Me</label>
            <textarea
              name="aboutMe"
              value={formData.aboutMe}
              onChange={handleInputChange}
              rows="4"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
            {aboutMeError && (
              <div className="text-red-600 text-sm mt-1">{aboutMeError}</div>
            )}
          </div>
        )}
        {stepConfig.includes('birthdate') && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Birthdate</label>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
            {birthdateError && (
              <div className="text-red-600 text-sm mt-1">{birthdateError}</div>
            )}
          </div>
        )}
        {stepConfig.includes('address') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Street Address</label>
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
              {addressErrors.streetAddress && (
                <div className="text-red-600 text-sm mt-1">{addressErrors.streetAddress}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
              {addressErrors.city && (
                <div className="text-red-600 text-sm mt-1">{addressErrors.city}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
              {addressErrors.state && (
                <div className="text-red-600 text-sm mt-1">{addressErrors.state}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
              {addressErrors.zip && (
                <div className="text-red-600 text-sm mt-1">{addressErrors.zip}</div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="mb-8">
          <div className="flex justify-between">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step ? 'bg-indigo-600 text-white' : 'bg-gray-200'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          {renderStep()}
          <div className="mt-8 flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Previous
              </button>
            )}
            {nextStepWithFields ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Next
              </button>
            ) : (
              hasRenderableFields(currentStep === 2 ? formConfig.page2 : formConfig.page3) && (
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Submit
                </button>
              )
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserOnboarding; 