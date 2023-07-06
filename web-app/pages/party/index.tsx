import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
import HomeLayout from '@/components/layouts/Home';
import Link from 'next/link';
import { useUser } from '@supabase/auth-helpers-react';

interface Party {
  name: string;
  description: string;
  id: string;
  status: number;
  zipcode: string;
  location: string;
  dateParty: string;
  owner: string;
  players: number;
  time: string;
}

const ITEMS_PER_PAGE = 6;

export default function New() {
  const [parties, setParties] = useState<Party[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoad, setIsLoad] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const user = useUser();

  useEffect(() => {
    document.body.classList.add('bg-custom-light-orange');
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/party`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        setIsLoad(false);
        setParties(
          data.Parties.filter(
            (party: { status: number; owner: string | undefined }) =>
              party.status === 1
          )
        );
      })
      .catch(error => {
        setError(error);
      });
  }, []);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = parties.slice(indexOfFirstItem, indexOfLastItem);

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPageCount = Math.min(Math.ceil(parties.length / ITEMS_PER_PAGE), 51);

    // Function previous for pagination
    const previous = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };

    // Function next for pagination
    const next = () => {
      if (currentPage < maxPageCount) {
        setCurrentPage(currentPage + 1);
      }
    };

    for (let i = Math.max(1, currentPage - 2); i <= Math.min(maxPageCount, currentPage + 2); i++) {
      pageNumbers.push(i);
    }

    return (
      <nav className="flex justify-center mt-10">
        <ul className="pagination inline-flex -space-x-px">
          <li>
            <a
              onClick={previous}
              className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Précédent
            </a>
          </li>
          {pageNumbers[0] !== 1 && (
            <>
              <li className="page-item">
                <a
                  onClick={() => handlePageChange(1)}
                  href="#"
                  className={`page-link px-3 py-2 leading-tight text-gray-500 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === 1 ? 'bg-white' : ''
                    }`}
                >
                  1
                </a>
              </li>
              {pageNumbers[0] !== 2 && (
                <li>
                  <span className="px-3 py-2 leading-tight text-gray-500 border border-gray-300">...</span>
                </li>
              )}
            </>
          )}
          {pageNumbers.map(number => (
            <li key={number} className="page-item">
              <a
                onClick={() => handlePageChange(number)}
                href="#"
                className={`page-link px-3 py-2 leading-tight text-gray-500 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === number ? 'bg-white' : ''
                  }`}
              >
                {number}
              </a>
            </li>
          ))}
          {pageNumbers[pageNumbers.length - 1] !== maxPageCount && (
            <>
              {pageNumbers[pageNumbers.length - 1] !== maxPageCount - 1 && (
                <li>
                  <span className="px-3 py-2 leading-tight text-gray-500 border border-gray-300">...</span>
                </li>
              )}
              <li className="page-item">
                <a
                  onClick={() => handlePageChange(maxPageCount)}
                  href="#"
                  className={`page-link px-3 py-2 leading-tight text-gray-500 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === maxPageCount ? 'bg-white' : ''
                    }`}
                >
                  {maxPageCount}
                </a>
              </li>
            </>
          )}
          <li>
            <a
              onClick={next}
              className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Suivant
            </a>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <>
      <Head>
        <title>Ludotter</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomeLayout>
        <section>
          <div className="container my-12 mx-auto px-4 md:px-12">
            {
              <div>
                {
                  isLoad ?
                    <div className="flex flex-col items-center">
                      <div role="status">
                        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                    :
                    currentItems.length === 0 ?
                      <div className="flex flex-col items-center">
                        <h2 className="mt-10 text-3xl font-semibold">Créer une nouvelle soirée maintenant !</h2>
                        <Link href="/party/new"
                          className="mt-10 text-white bg-custom-orange hover:bg-custom-hover-orange focus:outline-none font-medium rounded-lg text-sm md:text-base px-5 py-2.5 text-center">Créer
                          une soirée</Link>
                      </div>
                      :

                      <>
                        {/* Add a button to link /party/new */}
                        <div className="flex flex-col items-center">
                          <h2 className=" text-3xl font-semibold">Créer une nouvelle soirée maintenant !</h2>
                          <Link href="/party/new"
                            className="m-10 text-white bg-custom-orange hover:bg-custom-hover-orange focus:outline-none font-medium rounded-lg text-sm md:text-base px-5 py-2.5 text-center">Créer
                            une soirée</Link>
                        </div>
                        <div
                          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-y-10"
                          ref={containerRef}>

                          {currentItems.map((item, index) => (
                            <Link href={`/party/${encodeURIComponent(item.id)}`} key={index}>
                              <div
                                className="relative w-80 bg-white border border-gray-200 rounded-lg shadow mx-auto hover:-translate-y-3 hover:cursor-pointer hover:scale-105 duration-300">

                                <div className="p-5">
                                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{item.name}</h5>

                                  <p className="mb-3 font-normal truncate text-gray-700">{item.description}</p>
                                  <p className="mb-3 font-normal text-gray-700">{item.time}</p>
                                  <p className="mb-3 font-normal text-gray-700">{item.zipcode}</p>
                                  <p className="mb-3 font-normal text-gray-700">{item.dateParty}</p>
                                  <p className="mb-3 font-normal text-gray-700">{item.location}</p>
                                  <p className="mb-3 font-normal text-gray-700">{item.status === 1 ? 'Ouverte' : 'Complet'}</p>
                                  <div className="absolute bottom-0 right-0 mb-4 mr-4">
                                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-gray-100 bg-gray-600 rounded-full">{item.players} joueurs</span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </>
                }
                {renderPagination()}
              </div>
            }
          </div>
        </section>
      </HomeLayout>
    </>
  )
}


