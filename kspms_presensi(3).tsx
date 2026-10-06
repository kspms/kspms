import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Clock, Calendar, CheckCircle, XCircle, AlertCircle, 
  Home, ClipboardList, History, User, Users, Settings, LogOut, 
  Menu, X, BarChart, Play, Square, Camera, RotateCcw, Check, RefreshCw, AlertTriangle, Filter 
} from 'lucide-react';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }) => <div className={`p-5 border-b border-slate-100 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = '' }) => <h3 className={`text-lg font-semibold text-slate-800 ${className}`}>{children}</h3>;
const CardContent = ({ children, className = '' }) => <div className={`p-5 ${className}`}>{children}</div>;

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
    emerald: "bg-emerald-600 text-white hover:bg-emerald-700"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Input = ({ label, type = 'text', placeholder, value, onChange, className = '', required = false, step }) => (
  <div className={`space-y-1.5 ${className}`}>
    {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
    <input
      type={type} placeholder={placeholder} value={value} onChange={onChange} required={required} step={step}
      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors text-sm"
    />
  </div>
);

const Textarea = ({ label, placeholder, value, onChange, className = '', rows = 3, required = false }) => (
  <div className={`space-y-1.5 ${className}`}>
    {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
    <textarea
      placeholder={placeholder} value={value} onChange={onChange} rows={rows} required={required}
      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors text-sm resize-none"
    />
  </div>
);

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200"
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>{children}</span>;
};

const MOCK_MEMBERS = [
  { id: "KSPMS-001", name: "Siti Rahma", email: "siti@student.edu", role: "member" },
  { id: "KSPMS-002", name: "Rizky Pratama", email: "rizky@student.edu", role: "member" },
  { id: "KSPMS-003", name: "Dewi Lestari", email: "dewi@student.edu", role: "member" },
];

const MOCK_USER = MOCK_MEMBERS[0];
const MOCK_ADMIN = { name: "Admin KSPMS", role: "admin", id: "ADM-001", email: "admin@kspms.edu" };

// TODO: GANTI DENGAN KOORDINAT ASLI GERAI KSPMS SEBELUM TEST GPS DI LOKASI
const DEFAULT_STORE_CONFIG = {
  name: "Gerai Utama KSPMS FEB",
  latitude: -6.200000,
  longitude: 106.816666,
  radiusMeters: 50
};

const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDynamicSchedules = () => {
  const todayStr = getTodayDateString();
  return [
    { id: 1, dateKey: todayStr, date: "Hari Ini", time: "09:00 - 15:00", type: "STORE_DUTY", desc: "Sesi Pagi Gerai Utama" },
    { id: 2, dateKey: todayStr, date: "Hari Ini", time: "15:00 - 17:00", type: "OTHER_ACTIVITY", desc: "Kajian Rutin Pasar Modal" },
  ];
};

const INITIAL_HISTORY = [
  { 
    id: 1, 
    member_id: "KSPMS-002",
    memberName: "Rizky Pratama",
    dateKey: "2026-10-05",
    date: "Senin, 5 Oktober 2026", 
    type: "STORE_DUTY", 
    description: "-", 
    start: "09:05", 
    end: "10:15", 
    durationMinutes: 70, 
    validDurationMinutes: 70, 
    status: "VALID",
    photo: null,
    locationLogs: []
  },
  { 
    id: 2, 
    member_id: "KSPMS-003",
    memberName: "Dewi Lestari",
    dateKey: "2026-10-04",
    date: "Minggu, 4 Oktober 2026", 
    type: "OTHER_ACTIVITY", 
    description: "Rapat Divisi Edukasi", 
    start: "19:00", 
    end: "20:30", 
    durationMinutes: 90, 
    validDurationMinutes: 90, 
    status: "VALID",
    photo: null,
    locationLogs: [{ timestamp: new Date().toISOString(), latitude: -6.2000, longitude: 106.8166, distance: 10, status: "recorded" }]
  },
];

const formatDateFull = (date) => {
  return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};

const formatTime = (date) => {
  return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(date);
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const CameraCapture = ({ onCapture, onRetake, capturedPhoto }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [facingMode, setFacingMode] = useState('user');
  const [cameraError, setCameraError] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    let currentStream = null;

    const startCamera = async () => {
      setCameraError(null);
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Browser Anda tidak mendukung akses kamera langsung.");
        }

        const constraints = {
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        currentStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true);
        }
      } catch (err) {
        console.error("Gagal mengakses kamera:", err);
        let msg = "Gagal mengakses kamera perangkat.";
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          msg = "Izin kamera ditolak. Harap izinkan akses kamera di pengaturan browser Anda.";
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          msg = "Kamera tidak ditemukan pada perangkat ini.";
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          msg = "Kamera sedang digunakan oleh aplikasi lain.";
        }
        setCameraError(msg);
        setIsCameraActive(false);
      }
    };

    if (!capturedPhoto) {
      startCamera();
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode, capturedPhoto]);

  const handleTakeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
      onCapture(dataUrl);
    }
  };

  const toggleCameraFacing = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <Camera size={18} className="text-emerald-600" /> Foto Wajib Presensi (Kamera Langsung)
        </span>
        {isCameraActive && !capturedPhoto && (
          <Badge variant="info">
            {facingMode === 'user' ? 'Kamera Depan' : 'Kamera Belakang'}
          </Badge>
        )}
      </div>

      {cameraError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <XCircle size={16} /> Akses Kamera Bermasalah
          </div>
          <p>{cameraError}</p>
        </div>
      )}

      {!capturedPhoto ? (
        <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-inner aspect-[4/3] flex items-center justify-center">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />

          {!isCameraActive && !cameraError && (
            <div className="absolute text-white text-sm flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              Menghidupkan Kamera...
            </div>
          )}

          {isCameraActive && (
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4 px-4">
              <button 
                type="button"
                onClick={toggleCameraFacing}
                className="p-3 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full backdrop-blur-md transition-all shadow-lg"
                title="Ganti Kamera"
              >
                <RotateCcw size={20} />
              </button>
              
              <button 
                type="button"
                onClick={handleTakeSnapshot}
                className="w-16 h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-500/40 flex items-center justify-center transform active:scale-95 transition-all"
                title="Ambil Foto"
              >
                <div className="w-14 h-14 border-2 border-white rounded-full flex items-center justify-center">
                  <Camera size={28} />
                </div>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3 animate-in fade-in">
          <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-md aspect-[4/3]">
            <img src={capturedPhoto} alt="Hasil Foto Presensi" className="w-full h-full object-cover" />
            <div className="absolute top-3 right-3">
              <Badge variant="success" className="bg-emerald-600 text-white font-medium shadow-md">
                <Check size={12} className="mr-1" /> Foto Berhasil Diambil
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 py-3" onClick={onRetake}>
              <RotateCcw size={16} className="mr-2" /> Ambil Ulang
            </Button>
            <Button variant="emerald" className="flex-1 py-3 font-bold" disabled>
              <Check size={16} className="mr-2" /> Foto Terpilih & Siap
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const MemberLayout = ({ children, currentRoute, navigate }) => {
  const navItems = [
    { id: '/member', icon: Home, label: 'Beranda' },
    { id: '/member/schedule', icon: Calendar, label: 'Jadwal' },
    { id: '/member/attendance', icon: Clock, label: 'Absen' },
    { id: '/member/history', icon: History, label: 'Riwayat' },
    { id: '/member/profile', icon: User, label: 'Profil' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-0">
      <header className="bg-slate-900 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="font-bold text-lg flex items-center gap-2">
            <span className="text-emerald-400">KSPMS</span> Presensi
          </div>
          <button onClick={() => navigate('/login')} className="text-slate-300 hover:text-white" title="Keluar"><LogOut size={20} /></button>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-md mx-auto p-4 animate-in fade-in duration-300">
        {children}
      </main>

      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around max-w-md mx-auto left-0 right-0 z-20">
        {navItems.map((item) => {
          const isActive = currentRoute === item.id;
          return (
             <button key={item.id} onClick={() => navigate(item.id)} className={`flex flex-col items-center p-3 w-full transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'}`}>
                <item.icon size={24} className={isActive ? 'fill-emerald-50' : ''} />
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
             </button>
          )
        })}
      </nav>
    </div>
  );
};

const AdminLayout = ({ children, currentRoute, navigate }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navItems = [
    { id: '/admin', icon: BarChart, label: 'Dashboard' },
    { id: '/admin/attendance', icon: ClipboardList, label: 'Data Presensi' },
    { id: '/admin/members', icon: Users, label: 'Anggota' },
    { id: '/admin/schedules', icon: Calendar, label: 'Jadwal' },
    { id: '/admin/store', icon: Settings, label: 'Pengaturan Gerai' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <header className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="font-bold text-lg">Admin KSPMS</div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)}><Menu size={24} /></button>
      </header>

      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-slate-300 z-40 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
        <div className="p-6 text-white font-bold text-xl border-b border-slate-800 flex justify-between items-center">
          <span>KSPMS Admin</span>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = currentRoute === item.id;
            return (
              <button key={item.id} onClick={() => { navigate(item.id); setSidebarOpen(false); }} className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${isActive ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
                <item.icon size={20} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            )
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
           <button onClick={() => navigate('/login')} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-800 text-red-400 hover:text-red-300 transition-colors">
              <LogOut size={20} />
              <span className="font-medium text-sm">Keluar</span>
            </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-8 animate-in fade-in duration-300 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if(email.includes('admin')) onLogin('admin');
    else onLogin('member');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <div className="p-8 text-center bg-slate-900 rounded-t-xl text-white">
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500 mb-4 shadow-lg shadow-emerald-500/20">
             <Clock size={32} className="text-white" />
           </div>
           <h1 className="text-2xl font-bold tracking-tight">KSPMS Presensi</h1>
           <p className="text-slate-400 mt-2 text-sm">Sistem Kehadiran Pengurus & Anggota</p>
        </div>
        <CardContent className="p-6 space-y-6 pt-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" placeholder="contoh@student.edu" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            <Button type="submit" className="w-full mt-2" variant="emerald">Login</Button>
          </form>
          <div className="text-xs text-center text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
            <p className="font-semibold text-slate-700">Demo Mode Credentials:</p>
            <p>Email mengandung &quot;admin&quot; {'->'} Login Admin</p>
            <p>Email lainnya {'->'} Login Member</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MemberDashboard = ({ user, activeSession, attendanceResult, setAttendanceResult, navigate }) => {
  const todayStr = getTodayDateString();
  const schedules = getDynamicSchedules();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Halo, {user?.name}</h2>
        <p className="text-slate-500">{formatDateFull(new Date())}</p>
      </div>

      {attendanceResult && (
        <Card className={`border-2 ${attendanceResult.status === 'VALID' ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'} p-6 space-y-4 animate-in fade-in`}>
          <div className="flex justify-between items-center">
             <Badge variant={attendanceResult.status === 'VALID' ? 'success' : 'danger'}>
               Presensi Selesai: {attendanceResult.status}
             </Badge>
             <span className="text-xs text-slate-500">{attendanceResult.date}</span>
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">
              {attendanceResult.type === 'STORE_DUTY' ? 'Jaga Gerai' : 'Kegiatan Lainnya'}
            </h3>
            {attendanceResult.description && attendanceResult.description !== '-' && (
              <p className="text-sm text-slate-600 mt-1">{attendanceResult.description}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 text-sm">
            <div>
              <p className="text-xs text-slate-500">Durasi Presensi</p>
              <p className="font-bold text-slate-800">{attendanceResult.durationMinutes} Menit</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Durasi Valid</p>
              <p className="font-bold text-slate-800">{attendanceResult.validDurationMinutes} Menit</p>
            </div>
          </div>
          {attendanceResult.type === 'STORE_DUTY' && attendanceResult.status === 'INVALID' && (
            <p className="text-xs text-red-600 font-medium">Minimal durasi valid Jaga Gerai adalah 60 menit.</p>
          )}
          <Button variant="outline" className="w-full bg-white" onClick={() => setAttendanceResult(null)}>Tutup Pemberitahuan</Button>
        </Card>
      )}

      {activeSession.isActive ? (
        <Card className="border-emerald-200 bg-emerald-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-10 -mr-10 -mt-10"></div>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="success" className="mb-2">Sedang Aktif</Badge>
                <h3 className="font-bold text-lg text-emerald-900">
                  {activeSession.type === 'STORE_DUTY' ? 'Jaga Gerai' : 'Kegiatan Lainnya'}
                </h3>
                <p className="text-sm text-emerald-700 mt-1">
                  Dimulai pada {activeSession.startTime?.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
              <Clock size={40} className="text-emerald-300" />
            </div>
            <Button variant="emerald" className="w-full mt-4" onClick={() => navigate('/member/attendance')}>
              Lihat Presensi Aktif
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <ClipboardList size={32} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Belum ada presensi aktif</h3>
              <p className="text-sm text-slate-500 mt-1">Silakan lakukan presensi untuk memulai kegiatan Anda hari ini.</p>
            </div>
            <Button variant="primary" className="w-full" onClick={() => navigate('/member/attendance')}>
              Mulai Presensi Baru
            </Button>
          </CardContent>
        </Card>
      )}

      <div>
        <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <Calendar size={18} className="text-emerald-500"/> Jadwal Hari Ini ({todayStr})
        </h3>
        <div className="space-y-3">
          {schedules.filter(s => s.dateKey === todayStr).map(schedule => (
            <Card key={schedule.id} className="border-l-4 border-l-slate-900">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                   <p className="font-semibold text-sm">{schedule.desc}</p>
                   <p className="text-xs text-slate-500 mt-1">{schedule.time}</p>
                </div>
                <Badge variant={schedule.type === 'STORE_DUTY' ? 'default' : 'info'}>
                  {schedule.type === 'STORE_DUTY' ? 'Jaga Gerai' : 'Lainnya'}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const MemberAttendance = ({ user, activeSession, setActiveSession, storeConfig, setAttendanceResult, attendanceHistory, setAttendanceHistory }) => {
  const [time, setTime] = useState(new Date());
  const [attendanceType, setAttendanceType] = useState('STORE_DUTY');
  const [activityDesc, setActivityDesc] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  
  // Initial GPS state check for Store Duty
  const [initialGpsStatus, setInitialGpsStatus] = useState('checking'); 
  const [initialDistance, setInitialDistance] = useState(null);
  const [initialGpsErrorMsg, setInitialGpsErrorMsg] = useState('');

  // Other activity GPS state
  const [otherActivityGps, setOtherActivityGps] = useState({ status: 'idle', lat: null, lon: null, msg: '' });

  // Active session timers & GPS watch states
  const [elapsedTime, setElapsedTime] = useState(0);
  const [validDurationSeconds, setValidDurationSeconds] = useState(0);
  const [gpsTrackingStatus, setGpsTrackingStatus] = useState('checking'); 
  const [currentDistance, setCurrentDistance] = useState(null);
  const [gpsErrorMsg, setGpsErrorMsg] = useState('');

  const watchIdRef = useRef(null);
  const locationLogsRef = useRef([]);
  const gpsStatusRef = useRef(gpsTrackingStatus);
  
  // Precise Segment Tracking for Store Duty
  const validSegmentsRef = useRef([]); // [{start: timestamp, end: timestamp}]
  const currentSegmentStartRef = useRef(null);
  const sessionStartTimeRef = useRef(null);

  useEffect(() => {
    gpsStatusRef.current = gpsTrackingStatus;
  }, [gpsTrackingStatus]);

  // Clock interval
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initial GPS check for STORE_DUTY
  useEffect(() => {
    if (attendanceType === 'STORE_DUTY' && !activeSession.isActive) {
      setInitialGpsStatus('checking');
      setInitialGpsErrorMsg('');
      setInitialDistance(null);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const dist = calculateDistance(lat, lon, storeConfig.latitude, storeConfig.longitude);
            const roundedDist = Math.round(dist);
            setInitialDistance(roundedDist);
            if (roundedDist <= storeConfig.radiusMeters) {
              setInitialGpsStatus('inside');
            } else {
              setInitialGpsStatus('outside');
            }
          },
          (err) => {
            console.error("Initial GPS Error:", err);
            const errCode = err ? err.code : 0;
            if (errCode === 1) {
              setInitialGpsStatus('disabled');
              setInitialGpsErrorMsg("Izin GPS Ditolak. Harap izinkan akses lokasi.");
            } else if (errCode === 2) {
              setInitialGpsStatus('error');
              setInitialGpsErrorMsg("Lokasi GPS Tidak Tersedia.");
            } else if (errCode === 3) {
              setInitialGpsStatus('error');
              setInitialGpsErrorMsg("GPS Timeout / Tidak Merespons.");
            } else {
              setInitialGpsStatus('error');
              setInitialGpsErrorMsg("Gagal mendapatkan sinyal GPS.");
            }
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
        );
      } else {
        setInitialGpsStatus('error');
        setInitialGpsErrorMsg("Browser Anda tidak mendukung Geolocation API.");
      }
    } else if (attendanceType === 'OTHER_ACTIVITY' && !activeSession.isActive) {
      setOtherActivityGps({ status: 'checking', lat: null, lon: null, msg: '' });
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setOtherActivityGps({
              status: 'success',
              lat: lat,
              lon: lon,
              msg: 'Lokasi GPS berhasil dicatat.'
            });
          },
          (err) => {
            setOtherActivityGps({
              status: 'unavailable',
              lat: null,
              lon: null,
              msg: 'GPS tidak tersedia. Presensi tetap dapat dilanjutkan.'
            });
          },
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 5000 }
        );
      } else {
        setOtherActivityGps({ status: 'unavailable', lat: null, lon: null, msg: 'Browser tidak mendukung GPS.' });
      }
    }
  }, [attendanceType, activeSession.isActive, storeConfig]);

  // Active session tracking using watchPosition for STORE_DUTY
  useEffect(() => {
    let interval;
    if (activeSession.isActive && activeSession.startTime) {
      sessionStartTimeRef.current = activeSession.startTime.getTime();

      if (activeSession.type === 'STORE_DUTY' && navigator.geolocation) {
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
        }

        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const now = Date.now();
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const dist = calculateDistance(lat, lon, storeConfig.latitude, storeConfig.longitude);
            const roundedDist = Math.round(dist);
            setCurrentDistance(roundedDist);

            const status = roundedDist <= storeConfig.radiusMeters ? 'inside' : 'outside';
            setGpsTrackingStatus(status);
            setGpsErrorMsg('');

            locationLogsRef.current.push({
              timestamp: new Date().toISOString(),
              latitude: lat,
              longitude: lon,
              distanceFromStore: roundedDist,
              status: status
            });

            // Segment state transition logic based on real GPS callback
            if (status === 'inside') {
              if (!currentSegmentStartRef.current) {
                currentSegmentStartRef.current = now;
              }
            } else {
              if (currentSegmentStartRef.current) {
                validSegmentsRef.current.push({
                  start: currentSegmentStartRef.current,
                  end: now
                });
                currentSegmentStartRef.current = null;
              }
            }
          },
          (err) => {
            console.error("WatchPosition Error:", err);
            const errCode = err ? err.code : 0;
            if (errCode === 1) {
              setGpsTrackingStatus('disabled');
              setGpsErrorMsg("GPS Tidak Diizinkan.");
            } else if (errCode === 2) {
              setGpsTrackingStatus('error');
              setGpsErrorMsg("Lokasi GPS Tidak Tersedia.");
            } else if (errCode === 3) {
              setGpsTrackingStatus('error');
              setGpsErrorMsg("GPS Timeout.");
            } else {
              setGpsTrackingStatus('error');
              setGpsErrorMsg("Gagal melacak GPS.");
            }

            // Close active segment if GPS errors out
            const now = Date.now();
            if (currentSegmentStartRef.current) {
              validSegmentsRef.current.push({
                start: currentSegmentStartRef.current,
                end: now
              });
              currentSegmentStartRef.current = null;
            }

            locationLogsRef.current.push({
              timestamp: new Date().toISOString(),
              latitude: null,
              longitude: null,
              distanceFromStore: null,
              status: 'error'
            });
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
        );
      }

      // Timer ticker updating elapsed time & accurate timestamp segments
      interval = setInterval(() => {
        const now = Date.now();
        const diffSec = Math.floor((now - sessionStartTimeRef.current) / 1000);
        setElapsedTime(diffSec);

        if (activeSession.type === 'STORE_DUTY') {
          // Calculate total valid seconds from closed segments + ongoing segment if currently inside
          let totalValid = 0;
          const closedSegments = [...validSegmentsRef.current];
          if (gpsStatusRef.current === 'inside' && currentSegmentStartRef.current) {
            closedSegments.push({
              start: currentSegmentStartRef.current,
              end: now
            });
          }

          closedSegments.forEach(seg => {
            totalValid += Math.floor((seg.end - seg.start) / 1000);
          });

          setValidDurationSeconds(totalValid);
        } else {
          setValidDurationSeconds(diffSec);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [activeSession.isActive, activeSession.startTime, activeSession.type, storeConfig]);

  const handleStart = () => {
    if (attendanceType === 'OTHER_ACTIVITY') {
      if (!activityDesc.trim()) return;
      if (!capturedPhoto) return;
      startSessionProcess(attendanceType);
    } else {
      if (initialGpsStatus !== 'inside') return;
      if (!capturedPhoto) return;
      startSessionProcess(attendanceType);
    }
  };

  const startSessionProcess = (type) => {
    const startTime = new Date();
    setActiveSession({
      isActive: true,
      type: type,
      startTime: startTime,
      description: type === 'OTHER_ACTIVITY' ? activityDesc : null,
      photo: capturedPhoto
    });
    setValidDurationSeconds(0);
    setGpsTrackingStatus('checking');
    setCurrentDistance(initialDistance);
    
    if (type === 'OTHER_ACTIVITY' && otherActivityGps.status === 'success') {
      locationLogsRef.current = [{
        timestamp: startTime.toISOString(),
        latitude: otherActivityGps.lat,
        longitude: otherActivityGps.lon,
        distanceFromStore: null,
        status: 'recorded'
      }];
    } else {
      locationLogsRef.current = [];
    }

    validSegmentsRef.current = [];
    currentSegmentStartRef.current = null; // Will be set when watchPosition confirms 'inside'
  };

  const handleStop = () => {
    finishSession();
  };

  const finishSession = () => {
    const now = Date.now();
    if (activeSession.type === 'STORE_DUTY' && currentSegmentStartRef.current) {
      validSegmentsRef.current.push({
        start: currentSegmentStartRef.current,
        end: now
      });
      currentSegmentStartRef.current = null;
    }

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    const endTime = new Date();
    const totalDurationSec = sessionStartTimeRef.current ? Math.floor((now - sessionStartTimeRef.current) / 1000) : elapsedTime;
    
    let finalValidSec = validDurationSeconds;
    if (activeSession.type === 'STORE_DUTY') {
      let totalValid = 0;
      validSegmentsRef.current.forEach(seg => {
        totalValid += Math.floor((seg.end - seg.start) / 1000);
      });
      finalValidSec = totalValid;
    } else {
      finalValidSec = totalDurationSec;
    }

    const isStore = activeSession.type === 'STORE_DUTY';
    const finalStatus = isStore ? (finalValidSec >= 3600 ? 'VALID' : 'INVALID') : 'VALID';

    const lastLog = locationLogsRef.current[locationLogsRef.current.length - 1];
    const todayKey = getTodayDateString();
    const formattedDateStr = formatDateFull(endTime);

    const resultRecord = {
      id: Date.now(),
      member_id: user?.id || "KSPMS-001",
      memberName: user?.name || "Anggota",
      dateKey: todayKey,
      date: formattedDateStr,
      type: activeSession.type,
      description: activeSession.description || '-',
      start: activeSession.startTime?.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      end: endTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      durationMinutes: Math.max(1, Math.round(totalDurationSec / 60)),
      validDurationMinutes: Math.round(finalValidSec / 60),
      status: finalStatus,
      photo: activeSession.photo,
      latitude_in: locationLogsRef.current[0]?.latitude || (otherActivityGps.status === 'success' ? otherActivityGps.lat : null),
      longitude_in: locationLogsRef.current[0]?.longitude || (otherActivityGps.status === 'success' ? otherActivityGps.lon : null),
      latitude_out: lastLog?.latitude || null,
      longitude_out: lastLog?.longitude || null,
      locationLogs: [...locationLogsRef.current],
      validSegments: [...validSegmentsRef.current]
    };

    setAttendanceResult(resultRecord);
    setAttendanceHistory(prev => [resultRecord, ...prev]);

    setActiveSession({ isActive: false, type: null, startTime: null, description: null, photo: null });
    setElapsedTime(0);
    setValidDurationSeconds(0);
    setActivityDesc('');
    setCapturedPhoto(null);
  };

  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isFormValid = () => {
    if (!capturedPhoto) return false;
    if (attendanceType === 'STORE_DUTY' && initialGpsStatus !== 'inside') return false;
    if (attendanceType === 'OTHER_ACTIVITY' && !activityDesc.trim()) return false;
    return true;
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-4 bg-slate-900 rounded-2xl text-white shadow-lg">
        <p className="text-sm font-medium text-slate-400">{formatDateFull(time)}</p>
        <h2 className="text-4xl font-bold tracking-wider mt-1 font-mono">{formatTime(time)}</h2>
      </div>

      {!activeSession.isActive ? (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-3">Step 1: Pilih Jenis Kegiatan</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAttendanceType('STORE_DUTY')}
                className={`p-4 rounded-xl border-2 text-sm font-medium flex flex-col items-center gap-2 transition-all ${attendanceType === 'STORE_DUTY' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
              >
                <Home size={24} className={attendanceType === 'STORE_DUTY' ? 'text-emerald-600' : ''} />
                Jaga Gerai
              </button>
              <button
                type="button"
                onClick={() => setAttendanceType('OTHER_ACTIVITY')}
                className={`p-4 rounded-xl border-2 text-sm font-medium flex flex-col items-center gap-2 transition-all ${attendanceType === 'OTHER_ACTIVITY' ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
              >
                <ClipboardList size={24} className={attendanceType === 'OTHER_ACTIVITY' ? 'text-blue-600' : ''} />
                Kegiatan Lainnya
              </button>
            </div>
          </div>

          <Card>
            <CardContent className="p-5 space-y-5">
              {attendanceType === 'STORE_DUTY' ? (
                <div className="space-y-4 animate-in slide-in-from-right-4">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                     <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                     <p className="text-xs text-slate-600 leading-relaxed">
                       Sistem memvalidasi lokasi GPS Anda dalam radius {storeConfig.name} ({storeConfig.radiusMeters}m). Durasi valid minimal adalah <strong>60 menit</strong> di dalam radius.
                     </p>
                  </div>
                  
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status Lokasi GPS Awal</span>
                    <div className="mt-2 flex flex-col gap-2">
                       {initialGpsStatus === 'checking' && (
                         <Badge variant="warning" className="animate-pulse flex gap-1 w-fit"><MapPin size={12}/> Mencari lokasi GPS...</Badge>
                       )}
                       {initialGpsStatus === 'inside' && (
                         <Badge variant="success" className="flex gap-1 w-fit"><CheckCircle size={12}/> Dalam Radius Gerai ({initialDistance}m)</Badge>
                       )}
                       {initialGpsStatus === 'outside' && (
                         <Badge variant="danger" className="flex gap-1 w-fit"><XCircle size={12}/> Di Luar Radius Gerai ({initialDistance}m - Maks {storeConfig.radiusMeters}m)</Badge>
                       )}
                       {initialGpsStatus === 'error' && (
                         <Badge variant="danger" className="flex gap-1 w-fit"><XCircle size={12}/> {initialGpsErrorMsg || "GPS Error"}</Badge>
                       )}
                       {initialGpsStatus === 'disabled' && (
                         <Badge variant="warning" className="flex gap-1 w-fit"><AlertTriangle size={12}/> {initialGpsErrorMsg || "GPS Tidak Diizinkan"}</Badge>
                       )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-left-4">
                   <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                     <MapPin size={20} className="text-blue-500 shrink-0 mt-0.5" />
                     <p className="text-xs text-blue-800 leading-relaxed">
                       GPS akan mencatat koordinat lokasi kegiatan Anda. Tanpa validasi radius gerai.
                     </p>
                  </div>
                  <Textarea 
                    label="Keterangan Kegiatan (Wajib)" 
                    placeholder="Contoh: Rapat koordinasi pengurus KSPMS divisi humas..."
                    value={activityDesc}
                    onChange={(e) => setActivityDesc(e.target.value)}
                    required
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status GPS Kegiatan</span>
                    <div className="mt-2">
                      {otherActivityGps.status === 'checking' && (
                        <Badge variant="warning" className="animate-pulse"><MapPin size={12}/> Mendapatkan GPS...</Badge>
                      )}
                      {otherActivityGps.status === 'success' && (
                        <Badge variant="success"><CheckCircle size={12}/> {otherActivityGps.msg} ({otherActivityGps.lat?.toFixed(4)}, {otherActivityGps.lon?.toFixed(4)})</Badge>
                      )}
                      {otherActivityGps.status === 'unavailable' && (
                        <Badge variant="default"><AlertCircle size={12}/> {otherActivityGps.msg}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Ambil Foto Wajib */}
              <div className="pt-4 border-t border-slate-100">
                <CameraCapture 
                  capturedPhoto={capturedPhoto}
                  onCapture={(photoData) => setCapturedPhoto(photoData)}
                  onRetake={() => setCapturedPhoto(null)}
                />
              </div>

              {/* STEP 3 & 4: Validasi & Mulai Presensi */}
              <div className="pt-4 border-t border-slate-100">
                <Button 
                  variant="primary" 
                  className="w-full py-4 text-base font-bold flex items-center justify-center gap-2 shadow-md"
                  onClick={handleStart}
                  disabled={!isFormValid()}
                >
                  <Play size={20} fill="currentColor" />
                  Mulai Presensi
                </Button>
                {!isFormValid() && (
                  <p className="text-[11px] text-center text-amber-600 mt-2 font-medium">
                    *Harap pastikan GPS berada di dalam radius gerai (untuk Jaga Gerai), keterangan terisi (untuk kegiatan lain), dan foto berhasil diambil.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className={`border-2 ${activeSession.type === 'STORE_DUTY' ? 'border-emerald-500' : 'border-blue-500'} animate-in zoom-in-95`}>
          <div className={`p-4 text-center text-white ${activeSession.type === 'STORE_DUTY' ? 'bg-emerald-600' : 'bg-blue-600'} rounded-t-lg flex items-center justify-between`}>
             <h3 className="font-bold text-lg">
               {activeSession.type === 'STORE_DUTY' ? 'Sedang Jaga Gerai (GPS Active)' : 'Kegiatan Berlangsung'}
             </h3>
             {activeSession.photo && (
               <img src={activeSession.photo} alt="Bukti Presensi" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow" />
             )}
          </div>
          <CardContent className="p-6 space-y-6 text-center">
            <div>
              <p className="text-sm text-slate-500 font-medium">Waktu Mulai</p>
              <p className="text-xl font-bold text-slate-900">
                {activeSession.startTime?.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>

            {/* Timers display */}
            <div className="grid grid-cols-2 gap-3">
               <div className="py-4 px-3 bg-slate-50 rounded-xl border border-slate-100">
                 <p className="text-xs text-slate-500 font-medium mb-1">Durasi Presensi</p>
                 <div className="text-2xl font-mono font-bold text-slate-800">
                    {formatDuration(elapsedTime)}
                 </div>
               </div>
               
               <div className={`py-4 px-3 rounded-xl border ${activeSession.type === 'STORE_DUTY' ? (gpsTrackingStatus === 'inside' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200') : 'bg-blue-50 border-blue-200'}`}>
                 <p className="text-xs font-medium mb-1 text-slate-600">Durasi Valid</p>
                 <div className={`text-2xl font-mono font-bold ${activeSession.type === 'STORE_DUTY' ? (gpsTrackingStatus === 'inside' ? 'text-emerald-700' : 'text-amber-700') : 'text-blue-700'}`}>
                    {formatDuration(validDurationSeconds)}
                 </div>
               </div>
            </div>

            {/* GPS Live Tracking Card for Store Duty */}
            {activeSession.type === 'STORE_DUTY' && (
              <div className="text-left space-y-3">
                <div className={`p-4 rounded-xl border transition-all ${
                  gpsTrackingStatus === 'checking' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                  gpsTrackingStatus === 'inside' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
                  gpsTrackingStatus === 'outside' ? 'bg-red-50 border-red-200 text-red-900' :
                  'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {gpsTrackingStatus === 'checking' && <><RefreshCw size={18} className="text-amber-600 animate-spin" /> 🟡 Menunggu Konfirmasi GPS...</>}
                    {gpsTrackingStatus === 'inside' && <><CheckCircle size={18} className="text-emerald-600" /> 🟢 Lokasi Terverifikasi (Dalam Radius)</>}
                    {gpsTrackingStatus === 'outside' && <><XCircle size={18} className="text-red-600" /> 🔴 Di Luar Radius Gerai</>}
                    {gpsTrackingStatus === 'disabled' && <><AlertTriangle size={18} className="text-amber-600" /> ⚠️ GPS Tidak Diizinkan</>}
                    {gpsTrackingStatus === 'error' && <><AlertTriangle size={18} className="text-amber-600" /> ⚠️ Lokasi Tidak Tersedia</>}
                  </div>
                  
                  <div className="mt-2 text-xs space-y-1">
                    {currentDistance !== null && (
                      <p>Jarak saat ini dari gerai: <strong>{currentDistance} meter</strong> (Maks. {storeConfig.radiusMeters}m)</p>
                    )}
                    {gpsTrackingStatus === 'checking' && (
                      <p className="text-amber-700 font-semibold mt-1">
                        Menunggu sinyal GPS pertama untuk memulai perhitungan durasi valid.
                      </p>
                    )}
                    {gpsTrackingStatus === 'outside' && (
                      <p className="text-red-700 font-semibold mt-1">
                        Peringatan: Anda berada di luar radius gerai. Waktu di luar radius tidak dihitung sebagai durasi jaga valid.
                      </p>
                    )}
                    {gpsTrackingStatus === 'disabled' && (
                      <p className="text-amber-700 font-semibold mt-1">
                        Izin lokasi dicabut. Durasi valid dihentikan sementara.
                      </p>
                    )}
                    {gpsTrackingStatus === 'error' && (
                      <p className="text-amber-700 font-semibold mt-1">
                        {gpsErrorMsg || "GPS tidak dapat diverifikasi."} Durasi valid dihentikan sementara.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                   <div className="flex justify-between text-xs text-slate-500 mb-1">
                     <span>Target Durasi Valid (60 Menit)</span>
                     <span>{Math.min(Math.round((validDurationSeconds / 3600) * 100), 100)}%</span>
                   </div>
                   <div className="w-full bg-slate-200 rounded-full h-2.5">
                     <div 
                       className="bg-emerald-500 h-2.5 rounded-full transition-all duration-1000" 
                       style={{ width: `${Math.min((validDurationSeconds / 3600) * 100, 100)}%` }}
                     ></div>
                   </div>
                </div>
              </div>
            )}

            {activeSession.type === 'OTHER_ACTIVITY' && (
              <div className="text-left bg-blue-50 p-4 rounded-xl text-sm border border-blue-100 space-y-1">
                <span className="font-semibold text-blue-900 block">Keterangan Kegiatan:</span>
                <p className="text-blue-800">{activeSession.description}</p>
                {otherActivityGps.status === 'success' && (
                  <p className="text-xs text-blue-600 mt-2">✓ Lokasi GPS tercatat ({otherActivityGps.lat?.toFixed(4)}, {otherActivityGps.lon?.toFixed(4)})</p>
                )}
              </div>
            )}

            <Button 
              variant="danger" 
              className="w-full py-4 text-base font-bold flex items-center justify-center gap-2 shadow-md shadow-red-100"
              onClick={handleStop}
            >
              <Square size={20} fill="currentColor" />
              Selesai & Simpan Presensi
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const MemberSchedule = () => {
  const todayStr = getTodayDateString();
  const schedules = getDynamicSchedules();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Jadwal Saya</h2>
      {schedules.map(schedule => (
        <Card key={schedule.id} className={schedule.dateKey === todayStr ? 'border-l-4 border-l-emerald-500' : ''}>
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-3">
               <Badge variant={schedule.type === 'STORE_DUTY' ? 'default' : 'info'}>
                 {schedule.type === 'STORE_DUTY' ? 'Jaga Gerai' : 'Kegiatan Lain'}
               </Badge>
               <span className="text-sm font-semibold text-slate-900">{schedule.date}</span>
            </div>
            <h3 className="font-bold text-lg text-slate-800">{schedule.desc}</h3>
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
              <Clock size={16} /> {schedule.time}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const MemberHistory = ({ attendanceHistory }) => {
  const allHistory = [...attendanceHistory, ...INITIAL_HISTORY];
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Riwayat Presensi</h2>
      {allHistory.map(item => (
        <Card key={item.id} className="relative overflow-hidden">
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.status === 'VALID' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          <CardContent className="p-5 pl-6">
            <div className="flex justify-between items-start mb-2">
               <div>
                 <span className="text-sm font-semibold text-slate-900">{item.date}</span>
                 <span className="text-xs text-slate-400 ml-2">({item.memberName || "Anggota"})</span>
               </div>
               <Badge variant={item.status === 'VALID' ? 'success' : 'danger'}>{item.status}</Badge>
            </div>
            <h3 className="font-bold text-slate-800">
              {item.type === 'STORE_DUTY' ? 'Jaga Gerai' : 'Kegiatan Lainnya'}
            </h3>
            {item.description && item.description !== '-' && (
              <p className="text-sm text-slate-600 mt-1">{item.description}</p>
            )}
            
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-400">Waktu</p>
                <p className="text-sm font-medium text-slate-700">{item.start} - {item.end}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Durasi Valid</p>
                <p className="text-sm font-medium text-slate-700">{item.validDurationMinutes} Menit</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const MemberProfile = ({ user }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-slate-900 mb-6">Profil Saya</h2>
    <Card>
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400">
          <User size={40} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
        <p className="text-slate-500 text-sm uppercase tracking-wider">{user?.id}</p>
        <Badge variant="default" className="mt-2 capitalize">{user?.role}</Badge>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-0">
        <div className="p-4 border-b border-slate-100">
          <p className="text-xs text-slate-500">Email</p>
          <p className="font-medium text-slate-900">{user?.email}</p>
        </div>
        <div className="p-4 border-b border-slate-100">
          <p className="text-xs text-slate-500">Divisi / Posisi</p>
          <p className="font-medium text-slate-900">Anggota Aktif</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

const AdminDashboard = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-slate-900">Dashboard Admin</h1>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-slate-900 text-white"><CardContent className="p-5">
        <p className="text-slate-400 text-sm">Total Anggota</p>
        <p className="text-3xl font-bold mt-2">{MOCK_MEMBERS.length + 121}</p>
      </CardContent></Card>
      
      <Card><CardContent className="p-5">
        <p className="text-slate-500 text-sm">Presensi Hari Ini</p>
        <p className="text-3xl font-bold mt-2 text-slate-900">45</p>
      </CardContent></Card>

      <Card><CardContent className="p-5 border-b-4 border-emerald-500">
        <p className="text-slate-500 text-sm">Sedang Jaga Gerai</p>
        <p className="text-3xl font-bold mt-2 text-emerald-600">3</p>
      </CardContent></Card>

      <Card><CardContent className="p-5 border-b-4 border-blue-500">
        <p className="text-slate-500 text-sm">Kegiatan Lainnya</p>
        <p className="text-3xl font-bold mt-2 text-blue-600">12</p>
      </CardContent></Card>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <Card>
         <CardHeader><CardTitle>Statistik Validasi (Bulan Ini)</CardTitle></CardHeader>
         <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1"><span>Presensi Valid</span><span className="font-bold text-emerald-600">340</span></div>
              <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full w-[85%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span>Presensi Tidak Valid</span><span className="font-bold text-red-600">15</span></div>
              <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-red-500 h-2 rounded-full w-[15%]"></div></div>
            </div>
         </CardContent>
       </Card>
    </div>
  </div>
);

const AdminMembers = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-slate-900">Data Anggota</h1>
      <Button variant="primary" disabled title="Fitur ini tersedia setelah integrasi database Supabase">
        + Tambah Anggota (Nonaktif)
      </Button>
    </div>
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Nama</th>
              <th className="px-6 py-4 font-semibold text-slate-700">NIM / ID</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Email</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_MEMBERS.map(m => (
              <tr key={m.id}>
                <td className="px-6 py-4 font-medium">{m.name}</td>
                <td className="px-6 py-4">{m.id}</td>
                <td className="px-6 py-4">{m.email}</td>
                <td className="px-6 py-4"><span className="text-slate-400 text-xs">Tersimpan di DB</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

const AdminSchedules = () => {
  const schedules = getDynamicSchedules();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Jadwal Kegiatan</h1>
        <Button variant="primary" disabled title="Fitur ini tersedia setelah integrasi database Supabase">
          + Buat Jadwal (Nonaktif)
        </Button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Tanggal</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Waktu</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Jenis Kegiatan</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedules.map(s => (
                 <tr key={s.id}>
                   <td className="px-6 py-4 whitespace-nowrap">{s.date}</td>
                   <td className="px-6 py-4 whitespace-nowrap">{s.time}</td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <Badge variant={s.type === 'STORE_DUTY' ? 'default' : 'info'}>{s.type === 'STORE_DUTY' ? 'Jaga Gerai' : 'Lainnya'}</Badge>
                   </td>
                   <td className="px-6 py-4">{s.desc}</td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const AdminAttendance = ({ attendanceHistory }) => {
  const allHistory = [...attendanceHistory, ...INITIAL_HISTORY];
  const [filterDate, setFilterDate] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredHistory = allHistory.filter(item => {
    if (filterDate && item.dateKey !== filterDate) return false;
    if (filterName && !(item.memberName || "Anggota").toLowerCase().includes(filterName.toLowerCase())) return false;
    if (filterType !== 'ALL' && item.type !== filterType) return false;
    if (filterStatus !== 'ALL' && item.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Semua Data Presensi</h1>
      
      <Card className="bg-slate-50 border-dashed">
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
           <Input label="Filter Tanggal" type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
           <Input label="Cari Nama Anggota" placeholder="Ketik nama..." value={filterName} onChange={e => setFilterName(e.target.value)} />
           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1.5">Jenis Kegiatan</label>
             <select 
               className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500/50"
               value={filterType}
               onChange={e => setFilterType(e.target.value)}
             >
               <option value="ALL">Semua Jenis</option>
               <option value="STORE_DUTY">Jaga Gerai</option>
               <option value="OTHER_ACTIVITY">Kegiatan Lainnya</option>
             </select>
           </div>
           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
             <select 
               className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500/50"
               value={filterStatus}
               onChange={e => setFilterStatus(e.target.value)}
             >
               <option value="ALL">Semua Status</option>
               <option value="VALID">VALID</option>
               <option value="INVALID">INVALID</option>
             </select>
           </div>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Nama</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Tanggal</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Kegiatan</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Durasi Valid</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400">Tidak ada data presensi yang sesuai dengan filter.</td>
                </tr>
              ) : (
                filteredHistory.map((item, idx) => (
                  <tr key={idx}>
                     <td className="px-6 py-4 font-medium text-slate-900">{item.memberName || "Anggota"}</td>
                     <td className="px-6 py-4">{item.date}</td>
                     <td className="px-6 py-4">
                       <Badge variant={item.type === 'STORE_DUTY' ? 'default' : 'info'}>
                         {item.type === 'STORE_DUTY' ? 'Jaga Gerai' : 'Kegiatan Lainnya'}
                       </Badge>
                       {item.description && item.description !== '-' && <p className="text-xs text-slate-500 mt-1">{item.description}</p>}
                     </td>
                     <td className="px-6 py-4 font-mono">{item.validDurationMinutes} Menit</td>
                     <td className="px-6 py-4"><Badge variant={item.status === 'VALID' ? 'success' : 'danger'}>{item.status}</Badge></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const AdminStoreSettings = ({ storeConfig, setStoreConfig }) => {
  const [name, setName] = useState(storeConfig.name);
  const [lat, setLat] = useState(storeConfig.latitude);
  const [lon, setLon] = useState(storeConfig.longitude);
  const [radius, setRadius] = useState(storeConfig.radiusMeters);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const parsedLat = parseFloat(lat);
    const parsedLon = parseFloat(lon);
    const parsedRadius = parseInt(radius, 10);

    if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
      setErrorMsg('Latitude harus berupa angka antara -90 sampai 90.');
      return;
    }
    if (isNaN(parsedLon) || parsedLon < -180 || parsedLon > 180) {
      setErrorMsg('Longitude harus berupa angka antara -180 sampai 180.');
      return;
    }
    if (isNaN(parsedRadius) || parsedRadius <= 0) {
      setErrorMsg('Radius harus berupa angka lebih besar dari 0.');
      return;
    }

    setStoreConfig({
      name,
      latitude: parsedLat,
      longitude: parsedLon,
      radiusMeters: parsedRadius
    });
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">Pengaturan Gerai KSPMS</h1>
      {successMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-200">
          ✓ Pengaturan gerai berhasil diperbarui dan diterapkan ke sistem GPS!
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          ⚠️ {errorMsg}
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Lokasi Validasi GPS</CardTitle>
          <p className="text-sm text-slate-500 mt-1">Tentukan titik pusat dan radius area untuk fitur Jaga Gerai.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <Input label="Nama Gerai / Lokasi" value={name} onChange={e => setName(e.target.value)} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Latitude (-90 s/d 90)" type="number" step="any" value={lat} onChange={e => setLat(e.target.value)} required />
              <Input label="Longitude (-180 s/d 180)" type="number" step="any" value={lon} onChange={e => setLon(e.target.value)} required />
            </div>
            <Input label="Radius Toleransi (Meter > 0)" type="number" value={radius} onChange={e => setRadius(e.target.value)} required />
            
            <div className="pt-4 border-t border-slate-100">
               <Button type="submit" variant="primary">Simpan Pengaturan</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRoute, setCurrentRoute] = useState('/login');
  
  const [storeConfig, setStoreConfig] = useState(DEFAULT_STORE_CONFIG);
  const [attendanceResult, setAttendanceResult] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  const [activeSession, setActiveSession] = useState({
    isActive: false,
    type: null,
    startTime: null,
    description: null,
    photo: null
  });

  const handleLogin = (role) => {
    setCurrentUser(role === 'admin' ? MOCK_ADMIN : MOCK_USER);
    setCurrentRoute(role === 'admin' ? '/admin' : '/member');
  };

  const navigate = (path) => setCurrentRoute(path);

  const renderContent = () => {
    if (currentRoute === '/login') return <LoginPage onLogin={handleLogin} />;

    if (currentRoute.startsWith('/member') && currentUser?.role === 'member') {
      return (
        <MemberLayout currentRoute={currentRoute} navigate={navigate}>
          {currentRoute === '/member' && <MemberDashboard user={currentUser} activeSession={activeSession} attendanceResult={attendanceResult} setAttendanceResult={setAttendanceResult} navigate={navigate} />}
          {currentRoute === '/member/attendance' && <MemberAttendance user={currentUser} activeSession={activeSession} setActiveSession={setActiveSession} storeConfig={storeConfig} setAttendanceResult={setAttendanceResult} attendanceHistory={attendanceHistory} setAttendanceHistory={setAttendanceHistory} />}
          {currentRoute === '/member/schedule' && <MemberSchedule />}
          {currentRoute === '/member/history' && <MemberHistory attendanceHistory={attendanceHistory} />}
          {currentRoute === '/member/profile' && <MemberProfile user={currentUser} />}
        </MemberLayout>
      );
    }

    if (currentRoute.startsWith('/admin') && currentUser?.role === 'admin') {
      return (
        <AdminLayout currentRoute={currentRoute} navigate={navigate}>
          {currentRoute === '/admin' && <AdminDashboard />}
          {currentRoute === '/admin/members' && <AdminMembers />}
          {currentRoute === '/admin/schedules' && <AdminSchedules />}
          {currentRoute === '/admin/attendance' && <AdminAttendance attendanceHistory={attendanceHistory} />}
          {currentRoute === '/admin/store' && <AdminStoreSettings storeConfig={storeConfig} setStoreConfig={setStoreConfig} />}
        </AdminLayout>
      );
    }

    return (
       <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
             <h2 className="text-2xl font-bold text-slate-800">Akses Ditolak / Halaman Tidak Ditemukan</h2>
             <Button className="mt-4" onClick={() => navigate('/login')}>Kembali ke Login</Button>
          </div>
       </div>
    );
  };

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen selection:bg-emerald-200">
      {renderContent()}
    </div>
  );
}