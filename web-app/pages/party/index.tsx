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
}

const ITEMS_PER_PAGE = 6;

export default function New() {
  const [parties, setParties] = useState<Party[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
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
        setParties(
          data.filter(
            (party: { status: number; owner: string | undefined }) =>
              party.status === 1
          )
        );
      })
      .catch(error => {
        console.log(error);
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
                  className={`page-link px-3 py-2 leading-tight text-gray-500 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                    currentPage === 1 ? 'bg-white' : ''
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
                className={`page-link px-3 py-2 leading-tight text-gray-500 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                  currentPage === number ? 'bg-white' : ''
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
                  className={`page-link px-3 py-2 leading-tight text-gray-500 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                    currentPage === maxPageCount ? 'bg-white' : ''
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
                                    currentItems.length === 0 ?
                                        <div className="flex flex-col items-center">
                                            <h2 className="mt-10 text-3xl font-semibold">Créer une nouvelle soirée maintenant !</h2>
                                            <Link href="/party/new"
                                                className="mt-10 text-white bg-custom-orange hover:bg-custom-hover-orange focus:outline-none font-medium rounded-lg text-sm md:text-base px-5 py-2.5 text-center">Créer
                                                une soirée</Link>
                                        </div>
                                        :
                                        <div
                                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-y-10"
                                            ref={containerRef}>
                                            {currentItems.map((item, index) => (
                                                <Link href={`/party/${encodeURIComponent(item.id)}`} key={index}>
                                                    <div
                                                        className="relative w-80 bg-white border border-gray-200 rounded-lg shadow mx-auto hover:-translate-y-3 hover:cursor-pointer hover:scale-105 duration-300">

                                                        <div className="p-5">
                                                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{item.name}</h5>

                                                            <p className="mb-3 font-normal text-gray-700">{item.description}</p>
                                                            <p className="mb-3 font-normal text-gray-700">{item.zipcode}</p>
                                                            <p className="mb-3 font-normal text-gray-700">{item.dateParty}</p>
                                                            <p className="mb-3 font-normal text-gray-700">{item.owner === user?.id ? 'Postée par : (Moi) ' + user?.email : null}</p>

                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
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


