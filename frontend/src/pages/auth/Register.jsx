import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
  const [step, setStep]         = useState(1) // 1 = email, 2 = password
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError]     = useState('')
  const [passwordError, setPasswordError] = useState('')
  const navigate = useNavigate()

  /* ── Validate email / phone ── */
  const handleContinue = (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setEmailError('Enter your email or mobile number')
      return
    }
    setEmailError('')
    setStep(2)
  }

  /* ── Submit sign in ── */
  const handleSignIn = (e) => {
    e.preventDefault()
    if (!password.trim()) {
      setPasswordError('Enter your password')
      return
    }
    setPasswordError('')
    // TODO: call authApi.login(email, password)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center font-sans">

      {/* ── Logo ── */}
      <div className="mt-6 mb-4">
        <svg width="120" height="38" viewBox="0 0 150 48" fill="none">
          <text x="0" y="34" fill="black" fontSize="36" fontWeight="700"
            fontFamily="'Amazon Ember', Arial, sans-serif" letterSpacing="-1">
            amazon
          </text>
          <text x="130" y="34" fill="black" fontSize="16" fontWeight="400">.in</text>
          <path d="M4 40 Q70 54 138 40" stroke="#FF9900" strokeWidth="4"
            fill="none" strokeLinecap="round"/>
          <polygon points="134,37 144,40 135,43" fill="#FF9900"/>
        </svg>
      </div>

      {/* ═══════════════════════════
          STEP 1 — Email / Mobile
      ═══════════════════════════ */}
      {step === 1 && (
        <div className="w-full max-w-sm border border-gray-300 rounded-lg px-7 py-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-5">
            Sign in or create account
          </h1>

          <form onSubmit={handleContinue} noValidate>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Enter mobile number or email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
              autoFocus
              className={`w-full border rounded px-3 py-2 text-sm outline-none
                focus:border-[#e77600] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.5)]
                ${emailError ? 'border-red-500' : 'border-gray-400'}`}
            />
            {emailError && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <span className="font-bold">⚠</span> {emailError}
              </p>
            )}

            <button
              type="submit"
              className="w-full mt-4 bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#E8BB00]
                text-sm font-medium py-2 rounded-full transition-colors shadow-sm"
            >
              Continue
            </button>
          </form>

          {/* Terms */}
          <p className="text-xs text-gray-600 mt-4 leading-relaxed">
            By continuing, you agree to Amazon's{' '}
            <a href="/conditions" className="text-[#0066c0] hover:text-[#c45500] hover:underline">
              Conditions of Use
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-[#0066c0] hover:text-[#c45500] hover:underline">
              Privacy Notice
            </a>.
          </p>

          {/* Divider */}
          <div className="flex items-center gap-2 my-5">
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Buying for work */}
          <div>
            <p className="text-sm font-semibold text-gray-900">Buying for work?</p>
            <a
              href="/business/register"
              className="text-sm text-[#0066c0] hover:text-[#c45500] hover:underline"
            >
              Create a free business account
            </a>
          </div>
        </div>
      )}

      {/* ═══════════════════════════
          STEP 2 — Password
      ═══════════════════════════ */}
      {step === 2 && (
        <div className="w-full max-w-sm border border-gray-300 rounded-lg px-7 py-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Sign in</h1>

          {/* Email display + Change */}
          <div className="flex items-center gap-2 mb-4 text-sm">
            <span className="text-gray-800 font-medium">{email}</span>
            <button
              onClick={() => { setStep(1); setPassword(''); setPasswordError('') }}
              className="text-[#0066c0] hover:text-[#c45500] hover:underline font-medium"
            >
              Change
            </button>
          </div>

          <form onSubmit={handleSignIn} noValidate>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-semibold text-gray-900">Password</label>
              <a
                href="/forgot-password"
                className="text-xs text-[#0066c0] hover:text-[#c45500] hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError('') }}
              autoFocus
              className={`w-full border rounded px-3 py-2 text-sm outline-none
                focus:border-[#e77600] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.5)]
                ${passwordError ? 'border-red-500' : 'border-gray-400'}`}
            />
            {passwordError && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <span className="font-bold">⚠</span> {passwordError}
              </p>
            )}

            <button
              type="submit"
              className="w-full mt-4 bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#E8BB00]
                text-sm font-medium py-2 rounded-full transition-colors shadow-sm"
            >
              Sign in
            </button>
          </form>

          {/* Keep signed in */}
          <div className="flex items-start gap-2 mt-4">
            <input type="checkbox" id="keep" className="mt-0.5 cursor-pointer" />
            <label htmlFor="keep" className="text-xs text-gray-700 cursor-pointer leading-relaxed">
              Keep me signed in.{' '}
              <a href="/help/signin" className="text-[#0066c0] hover:underline">Details</a>
            </label>
          </div>
        </div>
      )}

      {/* ── Divider ── */}
      <div className="w-full max-w-sm mt-6">
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          <span className="mx-3 text-xs text-gray-400">New to Amazon?</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        </div>
        <Link to="/signup">
          <button className="w-full mt-3 border border-gray-300 hover:border-gray-500
            bg-gradient-to-b from-gray-50 to-gray-100 text-sm font-medium py-2 rounded
            transition-colors shadow-sm text-gray-800">
            Create your Amazon account
          </button>
        </Link>
      </div>

      {/* ── Footer ── */}
      <div className="mt-auto pt-10 pb-6 border-t border-gray-200 w-full text-center">
        <div className="flex justify-center gap-6 text-xs text-[#0066c0] mb-2">
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

export default Register