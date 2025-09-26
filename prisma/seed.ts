import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.course.create({
    data: {
      name: "Podstawy TypeScript",
      description: "Kurs wprowadzający do TypeScript dla początkujących.",
      imageSrc: "https://placehold.co/600x400?text=TypeScript",
      Chapter: {
        create: [
          {
            name: "Wprowadzenie",
            description: "Podstawowe informacje o kursie i TS.",
            Lesson: {
              create: [
                {
                  name: "Czym jest TypeScript?",
                  description: "Krótki wstęp i zalety korzystania z TS.",
                },
                {
                  name: "Instalacja i konfiguracja",
                  description: "Jak uruchomić środowisko TypeScript.",
                },
              ],
            },
          },
          {
            name: "Typy w TS",
            description: "Opis najważniejszych typów w TypeScript.",
            Lesson: {
              create: [
                {
                  name: "Typy proste",
                  description:
                    "Omówienie string, number, boolean, null, undefined.",
                },
                {
                  name: "Typy złożone",
                  description: "Tablice, obiekty i typy generyczne.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.course.create({
    data: {
      name: "React od podstaw",
      description: "Naucz się tworzyć aplikacje w React od zera.",
      imageSrc: "https://placehold.co/600x400?text=React",
      Chapter: {
        create: [
          {
            name: "Wprowadzenie do React",
            description: "Podstawowe informacje o React i jego architekturze.",
            Lesson: {
              create: [
                {
                  name: "JSX i komponenty",
                  description: "Tworzenie prostych komponentów.",
                },
                {
                  name: "Props i state",
                  description:
                    "Przekazywanie danych do komponentów i zarządzanie stanem.",
                },
              ],
            },
          },
          {
            name: "Zaawansowane techniki",
            description: "Hooki, Context API i optymalizacja aplikacji.",
            Lesson: {
              create: [
                {
                  name: "Hooki podstawowe",
                  description: "useState, useEffect, useRef.",
                },
                {
                  name: "Context API",
                  description: "Zarządzanie stanem globalnym.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.course.create({
    data: {
      name: "Node.js i Express",
      description: "Tworzenie backendu w Node.js z użyciem Express.",
      imageSrc: "https://placehold.co/600x400?text=Node.js",
      Chapter: {
        create: [
          {
            name: "Podstawy Node.js",
            description: "Środowisko Node i moduły.",
            Lesson: {
              create: [
                {
                  name: "Instalacja i uruchomienie",
                  description: "Pierwszy serwer Node.js.",
                },
                {
                  name: "Moduły i pakiety",
                  description: "Jak korzystać z npm i importować moduły.",
                },
              ],
            },
          },
          {
            name: "Express i REST API",
            description: "Tworzenie API i routing.",
            Lesson: {
              create: [
                {
                  name: "Tworzenie serwera Express",
                  description: "Podstawowe endpointy i middleware.",
                },
                {
                  name: "REST API",
                  description: "Operacje GET, POST, PUT, DELETE.",
                },
              ],
            },
          },
        ],
      },
    },
  });
}

main()
  .catch((error: unknown) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
