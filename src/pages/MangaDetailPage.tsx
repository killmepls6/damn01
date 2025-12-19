import { useParams, Link } from "wouter";
import { useState } from "react";
import { useMangaDetail } from "@/hooks/useMangaDetail";
import { useChapters } from "@/hooks/useChapters";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import CommentSection from "@/components/CommentSection";
import MangaDetailSkeleton from "@/components/ui/MangaDetailSkeleton";
import { SEO, StructuredData } from "@/components/SEO";
import { InlineAd } from "@/components/AdDisplay";

export default function MangaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { manga, isLoading, error, isError } = useMangaDetail(id!);
  const { chapters, isLoading: chaptersLoading, isError: chaptersError } = useChapters(id!);
  const { progress } = useReadingProgress(id);
  
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [sortAscending, setSortAscending] = useState(false);
  const [showAllChapters, setShowAllChapters] = useState(false);

  if (isLoading) {
    return <MangaDetailSkeleton />;
  }

  if (isError || !manga) {
    return (
      <div className="min-h-screen bg-[--theme_color] text-white select-none" style={{ '--theme_color': '#0a0e1a', '--header': '#0d1117', '--footer': '#0d1117', '--button': '#161b22' } as React.CSSProperties}>
        <div className="grid sm:gap-12 gap-[5vw] w-full 2xl:max-w-[90rem] max-w-7xl mx-auto sm:p-6 p-[5vw]">
          <div className="border border-slate-600/40 bg-slate-500/8 rounded-xl p-6 text-center">
            <h1 className="text-2xl font-semibold text-teal-400 mb-4">Series Not Available</h1>
            <p className="text-slate-400 mb-6">
              This series is currently unavailable or may have been removed.
            </p>
            <Link href="/">
              <div className="flex w-fit justify-center items-center h-12 gap-3 bg-slate-500/8 hover:bg-slate-400/12 transition-all duration-200 ease-in-out cursor-pointer rounded-xl px-6 mx-auto">
                <img className="w-6" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0xMC41IDE5LjVMMyAxMm0wIDBsNy41LTcuNU0zIDEyaDE4IiAvPjwvc3ZnPgo=" />
                <span className="text-white font-medium">Return Home</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Prepare genres for keywords
  const genresArray = manga.genres ? (Array.isArray(manga.genres) ? manga.genres : JSON.parse(manga.genres)) : [];
  const genresKeywords = genresArray.join(', ');

  return (
    <div className="bg-[--theme_color] text-white select-none" style={{ '--theme_color': '#0a0e1a', '--header': '#0d1117', '--footer': '#0d1117', '--button': '#161b22' } as React.CSSProperties}>
      {/* SEO Meta Tags */}
      <SEO
        title={manga.title}
        description={manga.description || `Read ${manga.title} - ${manga.type} ${manga.status} with ${chapters?.length || 0} chapters`}
        keywords={`${manga.title}, ${manga.type}, ${manga.status}, ${genresKeywords}, read ${manga.title} online, ${manga.title} chapters`}
        image={manga.coverImageUrl}
        type="book"
        author={manga.author || 'Unknown'}
        publishedTime={manga.createdAt}
        modifiedTime={manga.updatedAt}
      />
      
      {/* JSON-LD Structured Data - CreativeWorkSeries for Manga */}
      <StructuredData
        type="CreativeWorkSeries"
        data={{
          name: manga.title,
          description: manga.description || `Read ${manga.title} online`,
          image: manga.coverImageUrl,
          author: {
            "@type": "Person",
            name: manga.author || "Unknown"
          },
          genre: genresArray,
          inLanguage: "en",
          datePublished: manga.createdAt,
          dateModified: manga.updatedAt,
          aggregateRating: manga.rating ? {
            "@type": "AggregateRating",
            ratingValue: manga.rating,
            bestRating: "5",
            worstRating: "1"
          } : undefined,
          numberOfEpisodes: chapters?.length || 0,
          publisher: {
            "@type": "Organization",
            name: "PanelVerse Platform"
          },
          workExample: {
            "@type": "Book",
            bookFormat: "GraphicNovel",
            inLanguage: "en"
          }
        }}
      />
      {/* Header */}
      <header id="panel_header" className="grid sm:-mb-4 -mb-[4vw] sm:relative transition-all duration-200 ease-in-out sticky top-0 left-0 z-[161] border-slate-700/30">
        <div className="grid sm:gap-12 gap-[5vw] w-full 2xl:max-w-[90rem] max-w-7xl mx-auto sm:p-6 p-[5vw]">
          <div className="flex justify-between items-center">
            <div className="flex sm:gap-5 gap-[4.5vw] items-center">
              <Link href="/" className="flex w-fit justify-center items-center h-12 aspect-square gap-3 bg-slate-500/8 hover:bg-slate-400/12 transition-all duration-200 ease-in-out cursor-pointer rounded-full">
                <img className="w-6" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0xMC41IDE5LjVMMyAxMm0wIDBsNy41LTcuNU0zIDEyaDE4IiAvPjwvc3ZnPgo=" />
              </Link>
              <Link href="/" className="sm:block hidden sm:text-xl text-[4.5vw] font-semibold">
                PanelVerse
              </Link>
            </div>
            <Link href="/" className="sm:hidden break-word text-[4.5vw] font-semibold sf-hidden">
              PanelVerse
            </Link>
            <div className="flex sm:gap-5 gap-[4.5vw]">
              <div className="flex sm:pl-4 sm:w-fit w-11 justify-center items-center h-12 sm:px-5 gap-3 bg-slate-500/8 hover:bg-slate-400/12 transition-all duration-200 ease-in-out cursor-pointer rounded-full">
                <img className="w-6 ml-0.5" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0yMSAyMWwtNS4xOTctNS4xOTdtMCAwQTcuNSA3LjUgMCAxMDUuMTk2IDUuMTk2YTcuNSA3LjUgMCAwMDEwLjYwNyAxMC42MDd6IiAvPjwvc3ZnPgo=" />
                <div className="sm:block hidden font-medium">Find</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid sm:gap-12 gap-[5vw] w-full 2xl:max-w-[90rem] max-w-7xl mx-auto sm:p-6 p-[5vw]">
        {/* Background blur effect */}
        <div 
          className="w-[calc(100%+2.5rem)] sm:opacity-50 absolute top-0 left-0 blur-[100rem] -ml-10 sm:aspect-[2/1] aspect-[0.5/1] bg-cover bg-center" 
          style={{
            backgroundImage: manga.coverImageUrl ? `url(${manga.coverImageUrl})` : 'none'
          }}
        />
        
        <div className="flex w-full sm:gap-12 gap-[5vw] relative">
          <div className="grid sm:gap-12 gap-[5vw] w-full h-fit">
            <div className="grid sm:gap-12 gap-[5vw]">
              <div className="flex lg:flex-row flex-col sm:gap-12 gap-[5vw]">
                <div className="lg:block flex">
                  <div className="grid border border-slate-600/40 overflow-hidden rounded-xl sm:w-64 w-1/2">
                    <div 
                      className="bg-[image:--photoURL] aspect-[0.75/1] bg-cover bg-center bg-slate-500/8" 
                      style={{
                        '--photoURL': manga.coverImageUrl ? `url(${manga.coverImageUrl})` : 'none'
                      } as React.CSSProperties}
                    />
                  </div>
                </div>
                
                <div className="grid sm:gap-6 gap-[4vw] h-fit">
                  <div className="grid sm:gap-5 gap-[4.5vw]">
                    <h1 className="sm:text-5xl sm:leading-tight text-[9vw] leading-[1.1] font-semibold">
                      {manga.title}
                    </h1>
                    
                    <div className="grid">
                      <div className="text-base font-medium">Other Names</div>
                      <div className="flex flex-wrap gap-1 w-full mb-2">
                        <span className="text-md leading-none text-slate-400">No other names listed</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap sm:gap-3 gap-[2.5vw]">
                      <div className="leading-none bg-violet-600/75 border border-slate-700/30 h-9 px-3 flex justify-center items-center sm:gap-3 gap-[2.5vw] transition-all duration-200 ease-in-out cursor-pointer rounded-lg" title="Status">
                        <span className="capitalize">{manga.status}</span>
                      </div>
                      
                      <div className="leading-none h-9 px-3 flex justify-center items-center sm:gap-1.5 gap-[1.5vw] bg-slate-500/8 hover:bg-slate-400/12 transition-all duration-200 ease-in-out cursor-pointer rounded-lg" title="Series Type">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgNjQgNjQiPjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjMwIiBmaWxsPSIjZjVmNWY1Ii8+PHBhdGggZmlsbD0iI2VkNGM1YyIgZD0iTTIzLjQgMzMuN2MyLjggMS45IDYuNyAxLjEgOC42LTEuN3M1LjctMy42IDguNi0xLjdjMi43IDEuOCAzLjUgNS4zIDIgOGMzLjMtNS42IDEuOC0xMi45LTMuOC0xNi42Yy01LjctMy44LTEzLjQtMi4zLTE3LjIgMy40Yy0uMS4yLS4yLjQtLjMuNWMtMS40IDIuOS0uNSA2LjMgMi4xIDguMSIvPjxwYXRoIGZpbGw9IiMwMDM0NzgiIGQ9Ik00Mi4zIDM4LjljLjEtLjIuMi0uNC4zLS41Yy0uMS4xLS4yLjMtLjMuNSIvPjxwYXRoIGZpbGw9IiM0MjhiYzEiIGQ9Ik00MC42IDMwLjNjLTIuOC0xLjktNi43LTEuMS04LjYgMS43cy01LjcgMy42LTguNiAxLjdjLTIuNy0xLjgtMy41LTUuMy0yLThjLTMuNCA1LjYtMS44IDEyLjkgMy44IDE2LjZjNS43IDMuOCAxMy40IDIuMyAxNy4yLTMuNGMuMS0uMi4yLS40LjMtLjVjMS40LTIuOS41LTYuMy0yLjEtOC4xIi8+PC9zdmc+" className="w-5 -ml-1" alt="type" />
                        <span className="capitalize">{manga.type}</span>
                      </div>
                      
                      <div className="leading-none h-9 px-3 flex justify-center items-center sm:gap-1.5 gap-[1.5vw] bg-slate-500/8 hover:bg-slate-400/12 transition-all duration-200 ease-in-out cursor-pointer rounded-lg" title="Last Updated At">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0xMiA2djZoNC41bTQuNSAwYTkgOSAwIDExLTE4IDAgOSA5IDAgMDExOCAweiIgLz48L3N2Zz4K" className="w-5 -ml-1" alt="created at" />
                        <span>{manga.updatedAt ? new Date(manga.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown'}</span>
                      </div>
                      
                      {manga.genres && (() => {
                        try {
                          const genreArray = JSON.parse(manga.genres);
                          if (Array.isArray(genreArray)) {
                            return genreArray.map((genre, index) => (
                              <a key={index} href="#" className="leading-none h-9 px-3 flex justify-center items-center sm:gap-1.5 gap-[1.5vw] bg-slate-500/8 hover:bg-slate-400/12 transition-all duration-200 ease-in-out cursor-pointer rounded-lg" title={genre}>
                                <span className="capitalize">{genre}</span>
                              </a>
                            ));
                          }
                          return null;
                        } catch {
                          return null;
                        }
                      })()}
                    </div>
                  </div>
                  
                  <div className="grid">
                    <div id="description_content" className={`${isDescriptionExpanded ? 'h-auto' : 'sm:h-[6rem] h-[30vw]'} container overflow-hidden`} style={{ maxWidth: '100%' }}>
                      <p style={{ whiteSpace: 'pre-wrap' }} className="p-4 bg-slate-500/8 rounded-lg">
                        {manga.description || 'Description not provided.'}
                      </p>
                    </div>
                    
                    <div id="description_button_head" className="flex justify-center items-center -mt-7 relative">
                      <div 
                        id="description_button" 
                        className="leading-none h-9 px-3 flex w-fit justify-center items-center sm:gap-1.5 gap-[1.5vw] backdrop-blur-3xl bg-slate-500/8 hover:bg-slate-400/12 transition-all duration-200 ease-in-out cursor-pointer rounded-lg"
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      >
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0xOS41IDguMjVsLTcuNSA3LjUtNy41LTcuNSIgLz48L3N2Zz4K" className="w-5 -ml-1" alt="Expand" />
                        <span>{isDescriptionExpanded ? 'Show Less' : 'Read More'}</span>
                      </div>
                    </div>
                    
                    <style>
                      {`.container{-webkit-mask-image:linear-gradient(to bottom,black -150%,transparent 100%);mask-image:linear-gradient(to bottom,black 0%,transparent 100%)}`}
                    </style>
                  </div>
                  
                  <div className="flex sm:flex-row flex-col sm:mt-0 mt-2 sm:w-fit sm:gap-5 gap-[4.5vw]">
                    <div className="sm:flex grid grid-cols-2 sm:w-fit sm:gap-3 gap-[2.5vw]">
                      {progress && progress.chapterId ? (
                        (() => {
                          const continueChapter = chapters.find(ch => ch.id === progress.chapterId);
                          if (continueChapter) {
                            return (
                              <Link href={`/manga/${id}/chapter/${continueChapter.chapterNumber}`}>
                                <div className="flex justify-center items-center h-12 px-4 gap-3 bg-teal-600 hover:bg-teal-700 transition-all duration-200 ease-in-out rounded-lg cursor-pointer">
                                  <img className="w-7 -mx-1" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik01LjI1IDUuNjUzYzAtLjg1Ni45MTctMS4zOTggMS42NjctLjk4NmwxMS41NCA2LjM0OGExLjEyNSAxLjEyNSAwIDAxMCAxLjk3MWwtMTEuNTQgNi4zNDdhMS4xMjUgMS4xMjUgMCAwMS0xLjY2Ny0uOTg1VjUuNjUzeiIgLz48L3N2Zz4K" alt="Continue Reading" />
                                  <span className="font-medium">Continue Ch. {continueChapter.chapterNumber}</span>
                                </div>
                              </Link>
                            );
                          }
                        })()
                      ) : null}
                      {chapters.length > 0 ? (
                        <Link href={`/manga/${id}/chapter/${chapters.sort((a, b) => {
                          const aNum = Number(a.chapterNumber) || 0;
                          const bNum = Number(b.chapterNumber) || 0;
                          return aNum - bNum;
                        })[0]?.chapterNumber}`}>
                          <div className="flex justify-center items-center h-12 px-4 gap-3 bg-slate-500/8 hover:bg-slate-400/12 transition-all duration-200 ease-in-out rounded-lg cursor-pointer">
                            <img className="w-7 -mx-1" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik01LjI1IDUuNjUzYzAtLjg1Ni45MTctMS4zOTggMS42NjctLjk4NmwxMS41NCA2LjM0OGExLjEyNSAxLjEyNSAwIDAxMCAxLjk3MWwtMTEuNTQgNi4zNDdhMS4xMjUgMS4xMjUgMCAwMS0xLjY2Ny0uOTg1VjUuNjUzeiIgLz48L3N2Zz4K" alt="Start Reading" />
                            <span className="font-medium">{progress && progress.chapterId ? 'Restart' : 'Begin Reading'}</span>
                          </div>
                        </Link>
                      ) : (
                        <div className="flex justify-center items-center h-12 px-4 gap-3 bg-slate-500/4 opacity-50 transition-all duration-200 ease-in-out rounded-lg cursor-not-allowed">
                          <img className="w-7 -mx-1" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik01LjI1IDUuNjUzYzAtLjg1Ni45MTctMS4zOTggMS42NjctLjk4NmwxMS41NCA2LjM0OGExLjEyNSAxLjEyNSAwIDAxMCAxLjk3MWwtMTEuNTQgNi4zNDdhMS4xMjUgMS4xMjUgMCAwMS0xLjY2Ny0uOTg1VjUuNjUzeiIgLz48L3N2Zz4K" alt="Start Reading" />
                          <span className="font-medium">Begin Reading</span>
                        </div>
                      )}
                      
                      {chapters.length > 0 ? (
                        <Link href={`/manga/${id}/chapter/${chapters.sort((a, b) => {
                          const aNum = Number(a.chapterNumber) || 0;
                          const bNum = Number(b.chapterNumber) || 0;
                          return bNum - aNum;
                        })[0]?.chapterNumber}`}>
                          <div className="flex justify-center items-center h-12 px-4 gap-3 bg-slate-500/8 hover:bg-slate-400/12 transition-all duration-200 ease-in-out rounded-lg cursor-pointer">
                            <img className="w-7 -mx-1" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik01LjI1IDUuNjUzYzAtLjg1Ni45MTctMS4zOTggMS42NjctLjk4NmwxMS41NCA2LjM0OGExLjEyNSAxLjEyNSAwIDAxMCAxLjk3MWwtMTEuNTQgNi4zNDdhMS4xMjUgMS4xMjUgMCAwMS0xLjY2Ny0uOTg1VjUuNjUzeiIgLz48L3N2Zz4K" alt="New Chapter" />
                            <span className="font-medium">Latest</span>
                          </div>
                        </Link>
                      ) : (
                        <div className="flex justify-center items-center h-12 px-4 gap-3 bg-slate-500/4 opacity-50 transition-all duration-200 ease-in-out rounded-lg cursor-not-allowed">
                          <img className="w-7 -mx-1" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik01LjI1IDUuNjUzYzAtLjg1Ni45MTctMS4zOTggMS42NjctLjk4NmwxMS41NCA2LjM0OGExLjEyNSAxLjEyNSAwIDAxMCAxLjk3MWwtMTEuNTQgNi4zNDdhMS4xMjUgMS4xMjUgMCAwMS0xLjY2Ny0uOTg1VjUuNjUzeiIgLz48L3N2Zz4K" alt="New Chapter" />
                          <span className="font-medium">New Chapter</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="sm:h-full h-1 sm:w-1 w-full bg-slate-400/12 rounded-full"></div>
                    
                    <div className="flex sm:gap-3 gap-[2.5vw]">
                      <div id="bookmarkSeriesButton" className="flex sm:w-fit sm:min-w-[15rem] w-full justify-center items-center h-12 px-4 gap-3 bg-slate-500/8 hover:bg-slate-400/12 transition-all duration-200 ease-in-out cursor-pointer rounded-lg">
                        <img className="w-7 -mx-1" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0xNy41OTMgMy4zMjJjMS4xLjEyOCAxLjkwNyAxLjA3NyAxLjkwNyAyLjE4NVYyMUwxMiAxNy4yNSA0LjUgMjFWNS41MDdjMC0xLjEwOC44MDYtMi4wNTcgMS45MDctMi4xODVhNDguNTA3IDQ4LjUwNyAwIDAxMTEuMTg2IDB6IiAvPjwvc3ZnPgo=" alt="Add to Library" />
                        <span className="font-medium">Bookmark Series</span>
                      </div>
                      
                      <div className="sm:w-fit w-1/3 opacity-50 flex justify-center items-center h-12 sm:px-4 gap-3 bg-slate-500/8 transition-all duration-200 ease-in-out rounded-lg">
                        <img className="w-5" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0xNC44NTcgMTcuMDgyYTIzLjg0OCAyMy44NDggMCAwMDUuNDU0LTEuMzFBOC45NjcgOC45NjcgMCAwMTE4IDkuNzV2LS43VjlBNiA2IDAgMDA2IDl2Ljc1YTguOTY3IDguOTY3IDAgMDEtMi4zMTIgNi4wMjJjMS43MzMuNjQgMy41NiAxLjA4NSA1LjQ1NSAxLjMxbTUuNzE0IDBhMjQuMjU1IDI0LjI1NSAwIDAxLTUuNzE0IDBtNS43MTQgMGEzIDMgMCAxMS01LjcxNCAwIiAvPjwvc3ZnPgo=" alt="bell icon" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 sm:gap-4 gap-2">
                <div className="sm:flex hidden justify-between bg-gradient-to-b from-white/10 to-transparent gap-6 p-4 rounded-t-2xl overflow-hidden z-[1] col-span-full md:-mb-4">
                  <div className="flex gap-4 justify-center items-center">
                    <div className="h-full w-1 rounded-lg bg-slate-400/12"></div>
                    <div className="grid">
                      <div className="font-medium truncate">Share PanelVerse</div>
                      <div className="text-sm truncate">with others</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-10 gap-2 px-6 bg-slate-500/8 hover:bg-slate-400/12 flex justify-center items-center rounded-full transition-all duration-200 ease-in-out cursor-pointer">
                      <img alt="sharethis sharing button" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik03LjIxNyAxMC45MDdhMi4yNSAyLjI1IDAgMTAwIDIuMTg2bTAtMi4xODZjLjE4LjMyNC4yODMuNjk2LjI4MyAxLjA5M3MtLjEwMy43Ny0uMjgzIDEuMDkzbTAtMi4xODZsOS41NjYtNS4zMTRtLTkuNTY2IDcuNWw5LjU2NiA1LjMxNG0wIDBhMi4yNSAyLjI1IDAgMTAzLjkzNSAyLjE4NiAyLjI1IDIuMjUgMCAwMC0zLjkzNS0yLjE4NnptMC0xMi44MTRhMi4yNSAyLjI1IDAgMTAzLjkzMy0yLjE4NSAyLjI1IDIuMjUgMCAwMC0zLjkzMyAyLjE4NXoiIC8+PC9zdmc+Cg==" />
                      <span>Share</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between gap-6 bg-slate-500/8 p-4 rounded-xl">
                  <div className="flex gap-4 justify-center items-center">
                    <div className="w-fit h-full">
                      <div className="h-full w-1 rounded-lg bg-slate-400/12"></div>
                    </div>
                    <div className="grid">
                      <div className="font-medium truncate">Need Help?</div>
                      <div className="text-sm truncate">Contact support for assistance</div>
                    </div>
                  </div>
                  <button className="h-10 gap-2 px-6 bg-amber-500 hover:bg-amber-600 hover:bg-opacity-80 flex justify-center items-center rounded-full">
                    <div className="w-6">
                      <img className="w-6" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0xMiA5djMuNzVtOS0uNzVhOSA5IDAgMTEtMTggMCA5IDkgMCAwMTE4IDB6bS05IDMuNzVoLjAwOHYuMDA4SDEydi0uMDA4eiIgLz48L3N2Zz4K" />
                    </div>
                    <div className="font-medium">Flag Issue</div>
                  </button>
                </div>
                
                <div className="flex justify-between gap-6 bg-slate-500/8 p-4 rounded-xl">
                  <div className="flex gap-4 justify-center items-center">
                    <div className="h-full w-1 rounded-lg bg-slate-400/12"></div>
                    <div className="grid">
                      <div className="font-medium truncate">Connect With Us</div>
                      <div className="text-sm truncate">on social media</div>
                    </div>
                  </div>
                  <a href="#" target="_blank" className="h-10 gap-2 px-6 bg-[#7289da] hover:bg-opacity-80 flex justify-center items-center rounded-full" title="Community">
                    <div className="w-6">
                      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0xOC45NTcgNS42NjhhLjA2LjA2IDAgMCAwLS4wMjYtLjAyNGExNi41IDE2LjUgMCAwIDAtNC4wNzEtMS4yNjJhLjA2LjA2IDAgMCAwLS4wNjUuMDMxYTExIDExIDAgMCAwLS41MDcgMS4wNDFhMTUuMiAxNS4yIDAgMCAwLTQuNTczIDBBMTEgMTEgMCAwIDAgOS4yIDQuNDEzYS4wNy4wNyAwIDAgMC0uMDY2LS4wMzFhMTYuNSAxNi41IDAgMCAwLTQuMDcgMS4yNjJhLjEuMSAwIDAgMC0uMDI3LjAyM2ExNi44NiAxNi44NiAwIDAgMC0yLjk1NCAxMS4zNzlhLjA3LjA3IDAgMCAwIC4wMjYuMDQ3QTE2LjYgMTYuNiAwIDAgMCA3LjEgMTkuNjE2YS4wNi4wNiAwIDAgMCAuMDctLjAyM2ExMiAxMiAwIDAgMCAxLjAzLTEuNjYxYS4wNjQuMDY0IDAgMCAwLS4wMjgtLjA4NWgtLjAwN0ExMSAxMSAwIDAgMSA2LjYgMTcuMWEuMDY0LjA2NCAwIDAgMS0uMDIzLS4wODhsLjAxNi0uMDE5cS4xNTktLjExNy4zMS0uMjQyYS4wNi4wNiAwIDAgMSAuMDY1LS4wMDlhMTEuODMgMTEuODMgMCAwIDAgMTAuMDUxIDBhLjA2LjA2IDAgMCAxIC4wNjUuMDA4cS4xNTIuMTI2LjMxMS4yNDNhLjA2NS4wNjUgMCAwIDEgLjAxMy4wOWwtLjAxOC4wMTdhMTAuMyAxMC4zIDAgMCAxLTEuNTYxLjc0MmEuMDY0LjA2NCAwIDAgMC0uMDM3LjA4M3YuMDA2YTEzIDEzIDAgMCAwIDEuMDIxIDEuNjZhLjA2LjA2IDAgMCAwIC4wNy4wMjRhMTYuNiAxNi42IDAgMCAwIDUtMi41MjNhLjA3LjA3IDAgMCAwIC4wMjYtLjA0NmExNi43NiAxNi43NiAwIDAgMC0yLjk1Mi0xMS4zNzhNOC42ODMgMTQuNzc1YTEuOTIgMS45MiAwIDAgMS0xLjgtMi4wMTVhMS45MSAxLjkxIDAgMCAxIDEuOC0yLjAxNWExLjkgMS45IDAgMCAxIDEuOCAyLjAxNWExLjkxIDEuOTEgMCAwIDEtMS44IDIuMDE1bTYuNjQ2IDBhMS45MiAxLjkyIDAgMCAxLTEuOC0yLjAxNWExLjkxIDEuOTEgMCAwIDEgMS44LTIuMDE1YTEuOSAxLjkgMCAwIDEgMS44IDIuMDE1YTEuOTA2IDEuOTA2IDAgMCAxLTEuOCAyLjAxNSIvPjwvc3ZnPg==" className="w-6" alt="community" />
                    </div>
                    <div className="font-medium">Community</div>
                  </a>
                </div>
              </div>
              
              <InlineAd page="manga_detail" location="in_content_1" className="my-6" />
              
              <div className="flex items-center justify-between">
                <h2 className="sm:text-2xl text-[5.5vw] font-bold">{chapters.length} Chapter{chapters.length !== 1 ? 's' : ''}</h2>
                <div className="cursor-pointer group" id="sort_control" onClick={() => setSortAscending(!sortAscending)}>
                  <img className={`w-10 transition-all duration-200 ease-in-out ${sortAscending ? 'rotate-180' : ''}`} src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMTYgMTYiPjxnIGZpbGw9IndoaXRlIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMS4zNiA3LjA5OGMtMS4xMzcgMC0xLjcwOC0uNjU3LTEuNzYyLTEuMjc4aDEuMDA0Yy4wNTguMjIzLjM0My40NS43NzMuNDVjLjgyNCAwIDEuMTY0LS44MjkgMS4xMzMtMS44NTZoLS4wNTljLS4xNDguMzktLjU3Ljc0Mi0xLjI2MS43NDJjLS45MSAwLTEuNzItLjYxMy0xLjcyLTEuNzU4YzAtMS4xNDguODQ4LTEuODM2IDEuOTczLTEuODM2YzEuMDkgMCAyLjA2My42MzcgMi4wNjMgMi42ODhjMCAxLjg2Ny0uNzIzIDIuODQ4LTIuMTQ1IDIuODQ4em0uMDYyLTIuNzM1Yy41MDQgMCAuOTMzLS4zMzYuOTMzLS45NzJjMC0uNjMzLS4zOTgtMS4wMDgtLjk0LTEuMDA4Yy0uNTIgMC0uOTI3LjM3NS0uOTI3IDFjMCAuNjQuNDE4Ljk4LjkzNC45OCIvPjxwYXRoIGQ9Ik0xMi40MzggOC42NjhWMTRIMTEuMzlWOS42ODRoLS4wNTFsLTEuMjExLjg1OXYtLjk2OWwxLjI2Mi0uOTA2aDEuMDQ2ek00LjUgMi41YS41LjUgMCAwIDAtMSAwdjkuNzkzbC0xLjE0Ni0xLjE0N2EuNS41IDAgMCAwLS43MDguNzA4bDIgMS45OTlsLjAwNy4wMDdhLjQ5Ny40OTcgMCAwIDAgLjctLjAwNmwyLTJhLjUuNSAwIDAgMC0uNzA3LS43MDhMNC41IDEyLjI5M3oiLz48L2c+PC9zdmc+" alt="" />
                </div>
              </div>
              
              <div className="grid relative overflow-hidden">
                <div id="chapters_panel" className="grid containerz overflow-hidden">
                  <div id="chapters" className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-[3vw]">
                    {chaptersLoading ? (
                      <div className="flex items-center justify-center py-8 col-span-full">
                        <div className="animate-spin rounded-full h-9 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    ) : chaptersError ? (
                      <div className="border border-slate-600/40 bg-slate-500/8 rounded-xl p-6 text-center col-span-full">
                        <p className="text-gray-400">Failed to load chapters. Please try again later.</p>
                      </div>
                    ) : chapters.length === 0 ? (
                      <div className="border border-slate-600/40 bg-slate-500/8 rounded-xl p-6 text-center col-span-full">
                        <p className="text-gray-400">No chapters available yet.</p>
                      </div>
                    ) : (
                      (() => {
                        const sortedChapters = [...chapters].sort((a, b) => {
                          const aNum = Number(a.chapterNumber) || 0;
                          const bNum = Number(b.chapterNumber) || 0;
                          return sortAscending ? aNum - bNum : bNum - aNum;
                        });
                        
                        const chaptersToShow = showAllChapters ? sortedChapters : sortedChapters.slice(0, 12);
                        
                        return chaptersToShow.map((chapter) => (
                          <Link key={chapter.id} href={`/manga/${id}/chapter/${chapter.chapterNumber}`}>
                            <div className="group cursor-pointer relative overflow-hidden flex items-center justify-between sm:gap-5 gap-[4.5vw] hover:bg-slate-400/12 bg-slate-500/8 rounded-xl sm:p-2 p-[2vw] transition-all duration-200 ease-in-out">
                              <div className="flex items-center sm:gap-5 gap-[4.5vw]">
                                <div className="border inline-table border-slate-600/40 bg-slate-500/8 overflow-hidden rounded-xl relative">
                                  <div 
                                    className="aspect-[2/1.5] w-28 bg-slate-500/8 bg-cover bg-center rounded-lg" 
                                    style={{
                                      backgroundImage: manga.coverImageUrl ? 
                                        `url(${manga.coverImageUrl})` : 
                                        'none'
                                    }}
                                  />
                                </div>
                                <div className="grid h-fit">
                                  <span className="flex gap-1 justify-start items-center overflow-hidden">
                                    <span className="text-sm truncate">
                                      Chapter {chapter.chapterNumber}
                                      {chapter.title && <span className="text-xs text-white/70 ml-2">- {chapter.title}</span>}
                                    </span>
                                  </span>
                                  <div className="flex items-start flex-col justify-start gap-1.5">
                                    <div className="text-xs text-white/50 w-fit">
                                      {new Date(chapter.createdAt || Date.now()).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ));
                      })()
                    )}
                  </div>
                  
                  {!chaptersLoading && !chaptersError && chapters.length > 12 && (
                    <div className="flex justify-center mt-6">
                      <button 
                        onClick={() => setShowAllChapters(!showAllChapters)}
                        className="flex justify-center items-center h-12 px-6 gap-3 bg-slate-500/8 hover:bg-slate-400/12 transition-all duration-200 ease-in-out rounded-lg cursor-pointer"
                      >
                        <span className="font-medium">
                          {showAllChapters ? `Show Less` : `View All ${chapters.length} Chapters`}
                        </span>
                        <img 
                          className={`w-4 transition-transform ${showAllChapters ? 'rotate-180' : ''}`} 
                          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0xOS41IDguMjVsLTcuNSA3LjUtNy41LTcuNSIgLz48L3N2Zz4K" 
                          alt="Expand/Collapse" 
                        />
                      </button>
                    </div>
                  )}
                </div>

                {/* Comments Section */}
                <div className="mt-8">
                  <CommentSection seriesId={id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}