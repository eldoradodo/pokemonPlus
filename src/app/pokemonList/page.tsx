"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState, useEffect, ChangeEvent } from "react";
import type { Pokemon } from "@/types/type.pokemon";
import Link from "next/link";
import Image from "next/image";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";
import onLike from "../../../public/full_love.svg";
import offLike from "../../../public/bin_love.svg";
import { useSearchStore } from "@/zustand/useSearchStore";

const ITEMS_PER_PAGE: number = 20;

const PokemonPage: React.FC = () => {
  const [page, setPage] = useState<number>(1); // 페이지네이션 상태 값
  const [likedPokemons, setLikedPokemons] = useState<number[]>([]); // 좋아요 상태 값
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]); // 전체 포켓몬 데이터 상태 값
  const searchTerm = useSearchStore((state) => state.searchTerm); // 전역상태 검색 값

  // 전체 데이터를 가져오는 함수
  const fetchAllPokemons = async () => {
    try {
      const res = await axios.get<{ data: Pokemon[] }>("/api/pokemons");
      const { data } = res.data;

      setAllPokemons(data); // 전체 포켓몬 데이터 상태 업데이트
    } catch (error) {
      console.error("데이터를 불러오는 중 에러가 발생했습니다:", error);
    }
  };

  useEffect(() => {
    fetchAllPokemons(); // 컴포넌트가 마운트될 때 전체 데이터 한 번 가져오기
  }, []);

  // 페이지네이션 기능
  const { data: paginatedData, isFetching, error } = useQuery<{
    data: Pokemon[];
    hasNextPage: boolean;
    totalPages: number;
  }>({
    queryKey: ["pokemons", page],
    queryFn: async () => {
      const res = await axios.get<{ data: Pokemon[]; hasNextPage: boolean; totalPages: number }>(
        `/api/pokemons?page=${page}`
      );
      return res.data;
    },
  });

  if (isFetching && !paginatedData) {
    return <Loading />;
  }

  if (error) {
    return <div>에러가 발생했습니다.</div>;
  }

  const totalPages: number = paginatedData ? paginatedData.totalPages : 0;

  // 좋아요 기능
  const toggleLike = (pokemonId: number) => {
    if (likedPokemons.includes(pokemonId)) {
      setLikedPokemons(likedPokemons.filter((id) => id !== pokemonId));
    } else {
      setLikedPokemons([...likedPokemons, pokemonId]);
    }
  };

  // 필터 기능
  const filteredPokemons = allPokemons.filter((pokemon) =>
    pokemon.korean_name.includes(searchTerm)
  );

  const displayPokemons = searchTerm ? filteredPokemons : paginatedData?.data ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex flex-col items-center my-8">
        <h1 className="text-3xl text-center font-bold mt-4 mb-8">Pokémon</h1>
        {isFetching && <Loading />}
        {displayPokemons.length > 0 ? (
          <ul className="flex flex-wrap gap-6 max-w-[90%]">
            {displayPokemons.map((item) => (
              <li
                key={item.id}
                className="relative flex flex-col items-center p-4 bg-white border-2 border-solid border-gray-200 rounded-lg shadow-md hover:shadow-lg"
                style={{ maxWidth: "200px" }}
              >
                <Link href={`/pokemonList/${item.id}`}>
                  <div className="text-lg font-bold mb-2">No. {item.id}</div>
                  <div className="relative w-32 h-32 mb-2">
                    <Image
                      src={item.sprites.front_default}
                      alt={item.name}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <div className="text-sm text-center font-bold">
                    {item.korean_name}
                  </div>
                </Link>
                <button
                  onClick={() => toggleLike(item.id)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 focus:outline-none transform hover:scale-105 transition duration-300"
                >
                  {likedPokemons.includes(item.id) ? (
                    <Image
                      src={onLike}
                      alt="좋아요 활성화"
                      width={30}
                      height={30}
                      className="w-6 h-6"
                    />
                  ) : (
                    <Image
                      src={offLike}
                      alt="좋아요 비활성화"
                      width={30}
                      height={30}
                      className="w-6 h-6"
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center flex-grow">
            <span className="text-2xl font-bold">검색 결과가 없습니다</span>
          </div>
        )}
      </div>
      {!searchTerm && (
        <div className="w-full flex justify-center">
          <Pagination totalPages={totalPages} page={page} setPage={setPage} />
        </div>
      )}
    </div>
  );
};

export default PokemonPage;
