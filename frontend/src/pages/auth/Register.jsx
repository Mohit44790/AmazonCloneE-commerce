import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../apiData/api/axiosInstance' // your axios instance
import amazon from "../../assets/amazons.png"

/* ── Amazon SVG Logo ── */
const AmazonLogo = () => (
<img src={amazon} alt="" className='w-48' />
)

/* ── Reusable Input ── */
const FormInput = ({ label, type = 'text', value, onChange, error, placeholder, extra, autoFocus }) => (
  <div className="mb-3">
    <div className="flex items-center justify-between mb-1">
      <label className="text-sm font-semibold text-gray-900">{label}</label>
      {extra}
    </div>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className={`w-full border rounded px-3 py-2 text-sm outline-none transition-shadow
        focus:border-[#e77600] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.5)]
        ${error ? 'border-red-500 bg-red-50' : 'border-gray-400 bg-white'}`}
    />
    {error && (
      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
        <span>⚠</span> {error}
      </p>
    )}
  </div>
)

/* ── Password strength ── */
const getStrength = (pw) => {
  let score = 0
  if (pw.length >= 8)           score++
  if (/[A-Z]/.test(pw))         score++
  if (/[0-9]/.test(pw))         score++
  if (/[^A-Za-z0-9]/.test(pw))  score++
  return score
}

const StrengthBar = ({ password }) => {
  if (!password) return null
  const score = getStrength(password)
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', 'bg-red-500', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500']
  return (
    <div className="mt-1 mb-2">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors
            ${i <= score ? colors[score] : 'bg-gray-200'}`} />
        ))}
      </div>
      <p className={`text-xs font-medium ${
        score === 1 ? 'text-red-500' : score === 2 ? 'text-yellow-500' :
        score === 3 ? 'text-blue-500' : score === 4 ? 'text-green-600' : ''
      }`}>{labels[score]}</p>
    </div>
  )
}

/* ═══════════════════════════════════════
   MAIN COMPONENT — tab: signin / signup
═══════════════════════════════════════ */
export default function Register() {
  const navigate = useNavigate()

  /* tabs */
  const [tab, setTab] = useState('signin') // 'signin' | 'signup'

  /* signin state */
  const [signStep, setSignStep] = useState(1)
  const [signEmail, setSignEmail] = useState('')
  const [signPassword, setSignPassword] = useState('')
  const [signErrors, setSignErrors] = useState({})
  const [signLoading, setSignLoading] = useState(false)
  const [signServerError, setSignServerError] = useState('')
  const [showSignPw, setShowSignPw] = useState(false)

  /* signup state */
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  /* ── helpers ── */
  const setField = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '' }))
    setServerError('')
  }

  /* ── Validate Signup ── */
  const validateSignup = () => {
    const e = {}
    if (!form.name.trim())     e.name     = 'Enter your full name'
    if (!form.email.trim())    e.email    = 'Enter your email address'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                               e.email    = 'Enter a valid email address'
    if (!form.phone.trim())    e.phone    = 'Enter your mobile number'
    else if (!/^[+]?[\d\s]{10,15}$/.test(form.phone.replace(/\s/g, '')))
                               e.phone    = 'Enter a valid phone number'
    if (!form.password)        e.password = 'Enter a password'
    else if (form.password.length < 8)
                               e.password = 'Password must be at least 8 characters'
    else if (getStrength(form.password) < 2)
                               e.password = 'Password is too weak'
    if (!form.confirm)         e.confirm  = 'Re-enter your password'
    else if (form.confirm !== form.password)
                               e.confirm  = "Passwords don't match"
    return e
  }

  /* ── Submit Signup ── */
  const handleSignup = async (e) => {
    e.preventDefault()
    const errs = validateSignup()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setServerError('')
    try {
      await api.post('/auth/register', {
        name:     form.name.trim(),
        email:    form.email.trim().toLowerCase(),
        password: form.password,
        phone:    form.phone.trim(),
        role:     'customer',
      })
      navigate('/')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Sign In Step 1 ── */
  const handleSignStep1 = (e) => {
    e.preventDefault()
    if (!signEmail.trim()) {
      setSignErrors({ email: 'Enter your email or mobile number' }); return
    }
    setSignErrors({})
    setSignStep(2)
  }

  /* ── Submit Sign In ── */
  const handleSignIn = async (e) => {
    e.preventDefault()
    if (!signPassword.trim()) {
      setSignErrors({ password: 'Enter your password' }); return
    }
    setSignLoading(true)
    setSignServerError('')
    try {
      await api.post('/auth/login', {
        email:    signEmail.trim().toLowerCase(),
        password: signPassword,
      })
      navigate('/')
    } catch (err) {
      setSignServerError(err.response?.data?.message || 'Incorrect email or password.')
    } finally {
      setSignLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center font-sans px-4">

      {/* Logo */}
      <div className="mt-8 mb-5 cursor-pointer" onClick={() => navigate('/')}>
        <AmazonLogo />
      </div>

      {/* ── Tab Switcher ── */}
      <div className="flex w-full max-w-sm border border-gray-300 rounded-lg overflow-hidden mb-0">
        {['signin','signup'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors
              ${tab === t ? 'bg-[#232f3e] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
            {t === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        ))}
      </div>

      {/* ═══════════════ SIGN IN ═══════════════ */}
      {tab === 'signin' && (
        <div className="w-full max-w-sm border border-gray-300 border-t-0 rounded-b-lg px-7 py-6">

          {signServerError && (
            <div className="bg-red-50 border border-red-300 rounded px-3 py-2 text-xs text-red-700 mb-4 flex items-start gap-2">
              <span className="text-base leading-none mt-0.5">⚠</span>
              <span>{signServerError}</span>
            </div>
          )}

          {signStep === 1 && (
            <form onSubmit={handleSignStep1} noValidate>
              <h1 className="text-2xl font-semibold text-gray-900 mb-5">Sign in</h1>
              <FormInput
                label="Enter Mobile number or email"
                value={signEmail}
                onChange={(e) => { setSignEmail(e.target.value); setSignErrors({}) }}
                error={signErrors.email}
                autoFocus
              />
              <button type="submit"
                className="w-full mt-2 bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#E8BB00]
                  text-sm font-medium py-2 rounded-full transition-colors shadow-sm">
                Continue
              </button>
              <p className="text-xs text-gray-600 mt-4 leading-relaxed">
                By continuing, you agree to Amazon's{' '}
                <a href="/conditions" className="text-[#0066c0] hover:underline">Conditions of Use</a>{' '}
                and <a href="/privacy" className="text-[#0066c0] hover:underline">Privacy Notice</a>.
              </p>
              <hr className="my-5 border-gray-200" />
              <p className="text-sm font-semibold text-gray-900">Buying for work?</p>
              <a href="/business/register" className="text-sm text-[#0066c0] hover:underline">
                Create a free business account
              </a>
            </form>
          )}

          {signStep === 2 && (
            <form onSubmit={handleSignIn} noValidate>
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">Sign in</h1>
              <div className="flex items-center gap-2 mb-4 text-sm">
                <span className="text-gray-800 font-medium truncate">{signEmail}</span>
                <button type="button"
                  onClick={() => { setSignStep(1); setSignPassword(''); setSignErrors({}) }}
                  className="text-[#0066c0] hover:underline font-medium shrink-0">
                  Change
                </button>
              </div>

              <FormInput
                label="Password"
                type={showSignPw ? 'text' : 'password'}
                value={signPassword}
                onChange={(e) => { setSignPassword(e.target.value); setSignErrors({}) }}
                error={signErrors.password}
                autoFocus
                extra={
                  <div className="flex gap-3 items-center">
                    <button type="button" onClick={() => setShowSignPw(v => !v)}
                      className="text-xs text-[#0066c0] hover:underline">
                      {showSignPw ? 'Hide' : 'Show'}
                    </button>
                    <a href="/forgot-password"
                      className="text-xs text-[#0066c0] hover:underline">
                      Forgot password?
                    </a>
                  </div>
                }
              />

              <button type="submit" disabled={signLoading}
                className="w-full mt-2 bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#E8BB00]
                  text-sm font-medium py-2 rounded-full transition-colors shadow-sm
                  disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {signLoading && <span className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"/>}
                Sign in
              </button>

              <div className="flex items-start gap-2 mt-4">
                <input type="checkbox" id="keep" className="mt-0.5 cursor-pointer" />
                <label htmlFor="keep" className="text-xs text-gray-700 cursor-pointer leading-relaxed">
                  Keep me signed in.{' '}
                  <a href="/help" className="text-[#0066c0] hover:underline">Details</a>
                </label>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ═══════════════ SIGN UP ═══════════════ */}
      {tab === 'signup' && (
        <div className="w-full max-w-sm border border-gray-300 border-t-0 rounded-b-lg px-7 py-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-5">Create account</h1>

          {serverError && (
            <div className="bg-red-50 border border-red-300 rounded px-3 py-2 text-xs text-red-700 mb-4 flex items-start gap-2">
              <span className="text-base leading-none mt-0.5">⚠</span>
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSignup} noValidate>
            {/* Name */}
            <FormInput label="Your name" value={form.name}
              onChange={setField('name')} error={errors.name}
              placeholder="First and last name" autoFocus />

            {/* Email */}
            <FormInput label="Email" type="email" value={form.email}
              onChange={setField('email')} error={errors.email}
              placeholder="example@email.com" />

            {/* Phone */}
            <FormInput label="Mobile number" type="tel" value={form.phone}
              onChange={setField('phone')} error={errors.phone}
              placeholder="+91 98765 43210" />

            {/* Password */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-semibold text-gray-900">Password</label>
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="text-xs text-[#0066c0] hover:underline">
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={setField('password')}
                placeholder="At least 8 characters"
                className={`w-full border rounded px-3 py-2 text-sm outline-none transition-shadow
                  focus:border-[#e77600] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.5)]
                  ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-400 bg-white'}`}
              />
              <StrengthBar password={form.password} />
              {errors.password && (
                <p className="text-red-600 text-xs flex items-center gap-1">
                  <span>⚠</span> {errors.password}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Passwords must be at least 8 characters with uppercase, number and symbol.
              </p>
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-semibold text-gray-900">Re-enter password</label>
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  className="text-xs text-[#0066c0] hover:underline">
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showConfirm ? 'text' : 'password'}
                value={form.confirm}
                onChange={setField('confirm')}
                className={`w-full border rounded px-3 py-2 text-sm outline-none transition-shadow
                  focus:border-[#e77600] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.5)]
                  ${errors.confirm ? 'border-red-500 bg-red-50' : 'border-gray-400 bg-white'}`}
              />
              {errors.confirm && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.confirm}
                </p>
              )}
              {form.confirm && form.confirm === form.password && (
                <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                  <span>✓</span> Passwords match
                </p>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#E8BB00]
                text-sm font-medium py-2 rounded-full transition-colors shadow-sm
                disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"/>}
              Create your Amazon account
            </button>
          </form>

          <p className="text-xs text-gray-600 mt-4 leading-relaxed">
            By creating an account, you agree to Amazon's{' '}
            <a href="/conditions" className="text-[#0066c0] hover:underline">Conditions of Use</a>{' '}
            and <a href="/privacy" className="text-[#0066c0] hover:underline">Privacy Notice</a>.
          </p>

          <hr className="my-4 border-gray-200" />

          <p className="text-sm text-gray-700">
            Already have an account?{' '}
            <button onClick={() => setTab('signin')}
              className="text-[#0066c0] hover:underline font-medium">
              Sign in
            </button>
          </p>
        </div>
      )}

      {/* ── New to Amazon banner (sign in only) ── */}
      {tab === 'signin' && (
        <div className="w-full max-w-sm mt-4">
          <div className="relative flex items-center my-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="mx-3 text-xs text-gray-400 whitespace-nowrap">New to Amazon?</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <button onClick={() => setTab('signup')}
            className="w-full border border-gray-300 hover:border-gray-500
              bg-gradient-to-b from-gray-50 to-gray-100 text-sm font-medium py-2
              rounded transition-colors shadow-sm text-gray-800">
            Create your Amazon account
          </button>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="mt-auto pt-8 pb-6 border-t border-gray-200 w-full text-center mt-10">
        <div className="flex justify-center gap-6 text-xs text-[#0066c0] mb-2 flex-wrap">
          <a href="/conditions" className="hover:text-[#c45500] hover:underline">Conditions of Use</a>
          <a href="/privacy"    className="hover:text-[#c45500] hover:underline">Privacy Notice</a>
          <a href="/help"       className="hover:text-[#c45500] hover:underline">Help</a>
        </div>
        <p className="text-xs text-gray-500">
          © 1996–{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates
        </p>
      </div>
    </div>
  )
}