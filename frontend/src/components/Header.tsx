import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Menu, X, User, LogOut, Settings, LayoutDashboard, Shield, Sun, Moon } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navigationItems = [
    { id: '', label: 'Home', path: '/' },
    { id: 'blogs', label: 'Blogs', path: '/blogs' },
    { id: 'events', label: 'Events', path: '/events' },
    { id: 'about', label: 'About', path: '/about' },
  ];

  const handleLogout = () => {
    logout();
    onNavigate('');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-background/80 backdrop-blur-md border border-border/40 rounded-2xl shadow-lg px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold">ACE</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-foreground">
                  ACE Guilan
                </h1>
                <p className="text-sm text-muted-foreground">Computer Engineering</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    currentPage === item.id ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Theme Toggle & User Menu */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="h-10 w-10 rounded-xl"
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>

              {/* Desktop User Menu */}
              <div className="hidden md:flex items-center space-x-2">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-xl">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground capitalize">
                            {user.role}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onNavigate('profile')}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Profile Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onNavigate('dashboard')}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>My Dashboard</span>
                      </DropdownMenuItem>
                      {user.role === 'admin' && (
                        <DropdownMenuItem onClick={() => onNavigate('admin')}>
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex space-x-2">
                    <Link to="/login" className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                      Sign In
                    </Link>
                    <Link to="/register" className="px-4 py-2 rounded-xl text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="h-10 w-10 rounded-xl"
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-border/40">
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`block w-full text-left px-4 py-2 rounded-xl text-sm font-medium ${
                      currentPage === item.id ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* Mobile User Menu */}
                <div className="border-t border-border/40 pt-4 mt-4">
                  {user ? (
                    <div className="space-y-2">
                      <div className="px-3 py-2">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          onNavigate('profile');
                          setIsMenuOpen(false);
                        }}
                        className="w-full justify-start rounded-xl"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Profile Settings
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          onNavigate('dashboard');
                          setIsMenuOpen(false);
                        }}
                        className="w-full justify-start rounded-xl"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        My Dashboard
                      </Button>
                      {user.role === 'admin' && (
                        <Button
                          variant="ghost"
                          onClick={() => {
                            onNavigate('admin');
                            setIsMenuOpen(false);
                          }}
                          className="w-full justify-start rounded-xl"
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full justify-start rounded-xl"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        to="/login"
                        className="block w-full text-left px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="mr-2 h-4 w-4 inline" />
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="block w-full text-left px-4 py-2 rounded-xl text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}