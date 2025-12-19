import { useState, useCallback, useRef } from "react";
import { Link, useLocation } from "wouter";
import { 
  Search, Menu, BookOpen, Star, Clock, TrendingUp, 
  History, Library, Settings, Filter,
  User, UserPlus, ChevronDown, Shield, LogOut, X, Coins
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { useSearchState } from "@/hooks/useSearch";
import SearchResults from "@/components/SearchResults";
import { useCurrencyBalance } from "@/hooks/useCurrency";

export default function Navigation() {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const { logout, isLoggingOut } = useLogout();
  const [, navigate] = useLocation();
  const { data: balanceData } = useCurrencyBalance();
  
  // Search functionality
  const { 
    query: searchQuery, 
    setQuery: setSearchQuery, 
    filters, 
    updateFilter,
    isSearchActive,
    setIsSearchActive 
  } = useSearchState();
  
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const genres = [
    "Action", "Romance", "Fantasy", "Drama", "Comedy", 
    "Adventure", "Supernatural", "Slice of Life"
  ];

  // Search handlers
  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchResults(!!value.trim());
    setIsSearchActive(!!value.trim());
  }, [setSearchQuery, setIsSearchActive]);

  const handleSearchFocus = useCallback(() => {
    if (searchQuery.trim()) {
      setShowSearchResults(true);
    }
  }, [searchQuery]);

  const handleCloseSearch = useCallback(() => {
    setShowSearchResults(false);
    setShowAdvancedSearch(false);
  }, []);

  const handleResultClick = useCallback(() => {
    setShowSearchResults(false);
    setShowAdvancedSearch(false);
  }, []);

  const handleAdvancedSearchToggle = useCallback(() => {
    setShowAdvancedSearch(!showAdvancedSearch);
  }, [showAdvancedSearch]);

  const handleGenreSelect = useCallback((genre: string) => {
    updateFilter('genre', genre);
    setShowAdvancedSearch(false);
  }, [updateFilter]);

  const handleStatusSelect = useCallback((status: string) => {
    updateFilter('status', status);
    setShowAdvancedSearch(false);
  }, [updateFilter]);

  return (
    <nav className="bg-gradient-to-r from-background via-background to-background/95 border-b border-border/50 backdrop-blur-md bg-background/90 sticky top-0 z-50 shadow-lg shadow-primary/5 w-full">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-none">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 cursor-pointer hover:opacity-90 transition-opacity duration-200">
              <BookOpen className="w-8 h-8 text-primary drop-shadow-lg motion-safe:animate-pulse" />
              <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary via-accent to-purple-400 bg-clip-text text-transparent drop-shadow-sm truncate">
                MangaVerse
              </span>
            </div>
          </Link>

          {/* Central Search Bar with Advanced Toggle */}
          <div className="flex-1 max-w-3xl mx-4 sm:mx-6 lg:mx-8 hidden md:block">
            <div className="relative" ref={searchContainerRef}>
              <div className="flex items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 z-10 pointer-events-none" />
                  <Input
                    type="search"
                    placeholder="Search manga, manhwa, characters..."
                    className="h-12 pl-12 pr-4 w-full bg-card/80 backdrop-blur-sm border-2 border-card-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-card/95 transition-all duration-300 placeholder:text-muted-foreground/60 rounded-l-xl rounded-r-none text-base shadow-sm hover:shadow-md hover:bg-card/90"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={handleSearchFocus}
                    data-testid="search-input"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleAdvancedSearchToggle}
                  className={`h-12 w-12 rounded-l-none rounded-r-xl border-l-0 border-2 border-card-border/50 bg-card/80 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md ${showAdvancedSearch ? 'bg-primary/20 text-primary border-primary/50' : ''}`}
                  data-testid="advanced-search-toggle"
                >
                  <Filter className="w-5 h-5" />
                </Button>
              </div>

              {/* Search Results */}
              <SearchResults
                query={searchQuery}
                filters={filters}
                isOpen={showSearchResults}
                onClose={handleCloseSearch}
                onResultClick={handleResultClick}
              />

              {/* Advanced Search Panel */}
              {showAdvancedSearch && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-md border-2 border-card-border/50 rounded-xl p-4 shadow-xl z-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Genre</label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between bg-background/50">
                            {filters.genre || "Select Genre"} <ChevronDown className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48">
                          <DropdownMenuItem onClick={() => handleGenreSelect("")} className="hover:bg-primary/10">
                            All Genres
                          </DropdownMenuItem>
                          {genres.map((genre) => (
                            <DropdownMenuItem key={genre} onClick={() => handleGenreSelect(genre)} className="hover:bg-primary/10">
                              {genre}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Status</label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between bg-background/50">
                            {filters.status || "Any Status"} <ChevronDown className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleStatusSelect("")} className="hover:bg-primary/10">
                            Any Status
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusSelect("ongoing")} className="hover:bg-primary/10">
                            Ongoing
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusSelect("completed")} className="hover:bg-primary/10">
                            Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusSelect("hiatus")} className="hover:bg-primary/10">
                            Hiatus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side Navigation */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Quick Navigation - Only show when authenticated */}
            {isAuthenticated && (
              <div className="hidden lg:flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-primary/10 hover:text-primary transition-all duration-300" 
                  data-testid="nav-shop"
                  onClick={() => navigate("/shop")}
                >
                  <Coins className="w-4 h-4 mr-1" />
                  <span className="hidden xl:inline">Shop</span>
                  <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold bg-primary/20 text-primary rounded">
                    {balanceData?.balance || 0}
                  </span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-primary/10 hover:text-primary transition-all duration-300" 
                  data-testid="nav-history"
                  onClick={() => navigate("/history")}
                >
                  <History className="w-4 h-4 mr-1" />
                  <span className="hidden xl:inline">History</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-primary/10 hover:text-primary transition-all duration-300" 
                  data-testid="nav-library"
                  onClick={() => navigate("/library")}
                >
                  <Library className="w-4 h-4 mr-1" />
                  <span className="hidden xl:inline">Library</span>
                </Button>
              </div>
            )}

            {/* Authentication Section */}
            <div className="hidden md:flex items-center space-x-2">
              {isLoading ? (
                // Loading skeleton
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-muted/50 animate-pulse rounded-full"></div>
                  <div className="w-16 h-6 bg-muted/50 animate-pulse rounded"></div>
                </div>
              ) : isAuthenticated ? (
                // Profile Dropdown
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-8 w-8 rounded-full hover:bg-primary/10 transition-all duration-300"
                      data-testid="profile-dropdown"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImageUrl || user?.profilePicture || undefined} alt={user?.username || "Profile"} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                          {user?.username?.charAt(0)?.toUpperCase() || user?.firstName?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-md border-card-border/50">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImageUrl || user?.profilePicture || undefined} alt={user?.username || "Profile"} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {user?.username?.charAt(0)?.toUpperCase() || user?.firstName?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.username || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email || ""}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => navigate("/shop")} className="hover:bg-primary/10">
                      <Coins className="w-4 h-4 mr-2" />
                      <div className="flex items-center justify-between flex-1">
                        <span>Shop</span>
                        <span className="text-xs text-primary font-semibold ml-2">
                          {balanceData?.balance || 0}
                        </span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => navigate("/daily-rewards")} className="hover:bg-primary/10">
                      <Star className="w-4 h-4 mr-2" />
                      Daily Rewards
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => navigate("/achievements")} className="hover:bg-primary/10">
                      <Star className="w-4 h-4 mr-2" />
                      Achievements
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => navigate("/battle-pass")} className="hover:bg-primary/10">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Battle Pass
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => navigate("/subscriptions")} className="hover:bg-primary/10">
                      <Star className="w-4 h-4 mr-2 text-amber-500" />
                      VIP Subscriptions
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => navigate("/flash-sales")} className="hover:bg-primary/10">
                      <Star className="w-4 h-4 mr-2 text-red-500" />
                      ⚡ Flash Sales
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => navigate("/settings")} className="hover:bg-primary/10">
                      <User className="w-4 h-4 mr-2" />
                      Profile Settings
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onSelect={() => navigate("/admin")} className="hover:bg-primary/10">
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onSelect={() => logout()}
                      disabled={isLoggingOut}
                      className="hover:bg-primary/10 focus:bg-destructive/10 focus:text-destructive"
                      data-testid="logout-button"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {isLoggingOut ? "Signing out..." : "Sign out"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Login/Signup Buttons
                <>
                  <Link href="/login">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover:bg-primary/10 hover:text-primary transition-all duration-300 border border-transparent hover:border-primary/20"
                      data-testid="nav-login"
                    >
                      <User className="w-4 h-4 mr-1" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-primary/25 transition-all duration-300"
                      data-testid="nav-signup"
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* More Options Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
                  data-testid="nav-more-options"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-md border-card-border/50">
                {isAdmin && (
                  <DropdownMenuItem onSelect={() => navigate("/admin")} className="hover:bg-primary/10">
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="lg:hidden hover:bg-primary/10" onSelect={() => navigate("/shop")}>
                  <Coins className="w-4 h-4 mr-2" />
                  <div className="flex items-center justify-between flex-1">
                    <span>Shop</span>
                    <span className="text-xs text-primary font-semibold ml-2">
                      {balanceData?.balance || 0}
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="lg:hidden hover:bg-primary/10" onSelect={() => navigate("/history")}>
                  <History className="w-4 h-4 mr-2" />
                  History
                </DropdownMenuItem>
                <DropdownMenuItem className="lg:hidden hover:bg-primary/10" onSelect={() => navigate("/library")}>
                  <Library className="w-4 h-4 mr-2" />
                  Library
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-primary/10" onSelect={() => navigate("/browse?filter=popular")}>
                  <Star className="w-4 h-4 mr-2" />
                  Popular
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-primary/10" onSelect={() => navigate("/browse?filter=latest")}>
                  <Clock className="w-4 h-4 mr-2" />
                  Latest
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-primary/10" onSelect={() => navigate("/browse?filter=popular")}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden hover:bg-primary/10 hover:text-primary transition-all duration-300" 
              data-testid="mobile-menu"
              onClick={() => setShowMobileMenu(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <div className="flex">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 z-10 pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Search manga, manhwa..."
                  className="h-11 pl-11 pr-3 w-full bg-card/80 backdrop-blur-sm border-2 border-card-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-card/95 transition-all duration-300 placeholder:text-muted-foreground/60 rounded-l-lg rounded-r-none text-base shadow-sm"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={handleSearchFocus}
                  data-testid="mobile-search-input"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleAdvancedSearchToggle}
                className={`h-11 w-11 rounded-l-none rounded-r-lg border-l-0 border-2 border-card-border/50 bg-card/80 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 shadow-sm ${showAdvancedSearch ? 'bg-primary/20 text-primary border-primary/50' : ''}`}
                data-testid="mobile-advanced-search-toggle"
              >
                <Filter className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Mobile Search Results */}
            <SearchResults
              query={searchQuery}
              filters={filters}
              isOpen={showSearchResults}
              onClose={handleCloseSearch}
              onResultClick={handleResultClick}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-primary" />
              <span className="bg-gradient-to-r from-primary via-accent to-purple-400 bg-clip-text text-transparent">
                MangaVerse
              </span>
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 flex flex-col space-y-4">
            {/* User Profile Section */}
            {isLoading ? (
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-12 h-12 bg-muted animate-pulse rounded-full"></div>
                <div className="flex-1">
                  <div className="w-24 h-4 bg-muted animate-pulse rounded mb-2"></div>
                  <div className="w-32 h-3 bg-muted animate-pulse rounded"></div>
                </div>
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-3 p-3 bg-card border border-border rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.profileImageUrl || user?.profilePicture || undefined} alt={user?.username || "Profile"} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
                    {user?.username?.charAt(0)?.toUpperCase() || user?.firstName?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1">
                  <p className="text-sm font-semibold">
                    {user?.username || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || ""}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link href="/login">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button 
                    className="w-full justify-start bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            <Separator />

            {/* Main Navigation Items */}
            {isAuthenticated && (
              <>
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start hover:bg-primary/10 group"
                    onClick={() => {
                      navigate("/shop");
                      setShowMobileMenu(false);
                    }}
                  >
                    <Coins className="w-4 h-4 mr-2 text-primary" />
                    <span className="flex-1 text-left">Shop</span>
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-primary/20 text-primary rounded-full group-hover:bg-primary/30 transition-colors">
                      {balanceData?.balance || 0}
                    </span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start hover:bg-primary/10"
                    onClick={() => {
                      navigate("/history");
                      setShowMobileMenu(false);
                    }}
                  >
                    <History className="w-4 h-4 mr-2" />
                    History
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start hover:bg-primary/10"
                    onClick={() => {
                      navigate("/library");
                      setShowMobileMenu(false);
                    }}
                  >
                    <Library className="w-4 h-4 mr-2" />
                    Library
                  </Button>
                </div>
                <Separator />
                <div className="flex flex-col space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground px-2">Monetization</p>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start hover:bg-primary/10"
                    onClick={() => {
                      navigate("/subscriptions");
                      setShowMobileMenu(false);
                    }}
                  >
                    <Star className="w-4 h-4 mr-2 text-amber-500" />
                    VIP Subscriptions
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start hover:bg-primary/10"
                    onClick={() => {
                      navigate("/flash-sales");
                      setShowMobileMenu(false);
                    }}
                  >
                    <Star className="w-4 h-4 mr-2 text-red-500" />
                    ⚡ Flash Sales
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start hover:bg-primary/10"
                    onClick={() => {
                      navigate("/battle-pass");
                      setShowMobileMenu(false);
                    }}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Battle Pass
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start hover:bg-primary/10"
                    onClick={() => {
                      navigate("/daily-rewards");
                      setShowMobileMenu(false);
                    }}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Daily Rewards
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start hover:bg-primary/10"
                    onClick={() => {
                      navigate("/achievements");
                      setShowMobileMenu(false);
                    }}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Achievements
                  </Button>
                </div>
                <Separator />
              </>
            )}

            {/* Browse Navigation */}
            <div className="flex flex-col space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start hover:bg-primary/10"
                onClick={() => {
                  navigate("/browse?filter=popular");
                  setShowMobileMenu(false);
                }}
              >
                <Star className="w-4 h-4 mr-2" />
                Popular
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start hover:bg-primary/10"
                onClick={() => {
                  navigate("/browse?filter=latest");
                  setShowMobileMenu(false);
                }}
              >
                <Clock className="w-4 h-4 mr-2" />
                Latest
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start hover:bg-primary/10"
                onClick={() => {
                  navigate("/browse?filter=popular");
                  setShowMobileMenu(false);
                }}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Trending
              </Button>
            </div>

            {isAuthenticated && (
              <>
                <Separator />
                {/* Settings and Profile */}
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start hover:bg-primary/10"
                    onClick={() => {
                      navigate("/settings");
                      setShowMobileMenu(false);
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Profile Settings
                  </Button>
                  {isAdmin && (
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start hover:bg-primary/10"
                      onClick={() => {
                        navigate("/admin");
                        setShowMobileMenu(false);
                      }}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Button>
                  )}
                </div>

                <Separator />

                {/* Logout */}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => {
                    logout();
                    setShowMobileMenu(false);
                  }}
                  disabled={isLoggingOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {isLoggingOut ? "Signing out..." : "Sign out"}
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}