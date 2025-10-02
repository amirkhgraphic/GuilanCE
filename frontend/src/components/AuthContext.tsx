import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'faculty' | 'admin' | 'superuser';
  phone?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  avatar?: string;
  bio?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: 'student' | 'faculty') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  verifyEmail: (otp: string) => Promise<boolean>;
  verifyPhone: (otp: string) => Promise<boolean>;
  sendEmailOTP: () => Promise<boolean>;
  sendPhoneOTP: () => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  getAllUsers: () => User[];
  promoteToAdmin: (userId: string) => Promise<boolean>;
  demoteFromAdmin: (userId: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '0',
    email: 'superuser@guilan.ac.ir',
    name: 'Super Administrator',
    role: 'superuser',
    phone: '+98 13 33690999',
    emailVerified: true,
    phoneVerified: true,
    bio: 'System Super Administrator for ACE Guilan',
    token: 'mock-superuser-token-0',
  },
  {
    id: '1',
    email: 'admin@guilan.ac.ir',
    name: 'Admin User',
    role: 'admin',
    phone: '+98 13 33690000',
    emailVerified: true,
    phoneVerified: true,
    bio: 'System Administrator for ACE Guilan',
    token: 'mock-admin-token-1',
  },
  {
    id: '2',
    email: 'ahmad.mohammadi@guilan.ac.ir',
    name: 'Dr. Ahmad Mohammadi',
    role: 'faculty',
    phone: '+98 13 33690001',
    emailVerified: true,
    phoneVerified: false,
    bio: 'Associate Professor of Computer Engineering',
    token: 'mock-faculty-token-2',
  },
  {
    id: '3',
    email: 'ali.rezaei@student.guilan.ac.ir',
    name: 'Ali Rezaei',
    role: 'student',
    phone: '+98 901 234 5678',
    emailVerified: false,
    phoneVerified: false,
    bio: 'Computer Engineering Student, Class of 2025',
    token: 'mock-student-token-3',
  },
  {
    id: '4',
    email: 'sara.hosseini@student.guilan.ac.ir',
    name: 'Sara Hosseini',
    role: 'student',
    phone: '+98 901 345 6789',
    emailVerified: true,
    phoneVerified: true,
    bio: 'Computer Engineering Student, Class of 2024',
    token: 'mock-student-token-4',
  },
  {
    id: '5',
    email: 'mehdi.karimi@guilan.ac.ir',
    name: 'Dr. Mehdi Karimi',
    role: 'faculty',
    phone: '+98 13 33690002',
    emailVerified: true,
    phoneVerified: true,
    bio: 'Professor of Artificial Intelligence',
    token: 'mock-faculty-token-5',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = mockUsers.find(u => u.email === email);

    if (foundUser && password.length >= 6) {
      setUser(foundUser);
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const register = async (email: string, password: string, name: string, role: 'student' | 'faculty'): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }

    if (password.length >= 6 && name.length >= 2) {
      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        email,
        name,
        role,
        emailVerified: false,
        phoneVerified: false,
        token: `mock-${role}-token-${mockUsers.length + 1}`,
      };

      mockUsers.push(newUser);
      setUser(newUser);
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);

      // Update in mock data
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser;
      }

      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const sendEmailOTP = async (): Promise<boolean> => {
    // Simulate sending OTP
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  };

  const sendPhoneOTP = async (): Promise<boolean> => {
    // Simulate sending OTP
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  };

  const verifyEmail = async (otp: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple validation - accept any 6-digit code
    if (otp.length === 6 && user) {
      const updatedUser = { ...user, emailVerified: true };
      setUser(updatedUser);

      // Update in mock data
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser;
      }

      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const verifyPhone = async (otp: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple validation - accept any 6-digit code
    if (otp.length === 6 && user) {
      const updatedUser = { ...user, phoneVerified: true };
      setUser(updatedUser);

      // Update in mock data
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser;
      }

      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const deleteAccount = async (): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (user) {
      // Remove from mock data
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers.splice(userIndex, 1);
      }

      setUser(null);
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const getAllUsers = (): User[] => {
    return mockUsers;
  };

  const promoteToAdmin = async (userId: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      mockUsers[userIndex].role = 'admin';
      if (user && user.id === userId) {
        setUser({ ...user, role: 'admin' });
      }
    }

    setIsLoading(false);
    return true;
  };

  const demoteFromAdmin = async (userId: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      mockUsers[userIndex].role = 'faculty';
      if (user && user.id === userId) {
        setUser({ ...user, role: 'faculty' });
      }
    }

    setIsLoading(false);
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isLoading,
      updateProfile,
      verifyEmail,
      verifyPhone,
      sendEmailOTP,
      sendPhoneOTP,
      deleteAccount,
      getAllUsers,
      promoteToAdmin,
      demoteFromAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}