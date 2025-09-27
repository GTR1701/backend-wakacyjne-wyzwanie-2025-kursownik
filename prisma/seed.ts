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
            chapterOrder: 1,
            Lesson: {
              create: [
                {
                  name: "Czym jest TypeScript?",
                  description: "Krótki wstęp i zalety korzystania z TS.",
                  lessonOrder: 1,
                },
                {
                  name: "Instalacja i konfiguracja",
                  description: "Jak uruchomić środowisko TypeScript.",
                  lessonOrder: 2,
                },
              ],
            },
          },
          {
            name: "Typy w TS",
            description: "Opis najważniejszych typów w TypeScript.",
            chapterOrder: 2,
            Lesson: {
              create: [
                {
                  name: "Typy proste",
                  description:
                    "Omówienie string, number, boolean, null, undefined.",
                  lessonOrder: 1,
                },
                {
                  name: "Typy złożone",
                  description: "Tablice, obiekty i typy generyczne.",
                  lessonOrder: 2,
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
            chapterOrder: 1,
            Lesson: {
              create: [
                {
                  name: "JSX i komponenty",
                  description: "Tworzenie prostych komponentów.",
                  lessonOrder: 1,
                },
                {
                  name: "Props i state",
                  description:
                    "Przekazywanie danych do komponentów i zarządzanie stanem.",
                  lessonOrder: 2,
                },
              ],
            },
          },
          {
            name: "Zaawansowane techniki",
            description: "Hooki, Context API i optymalizacja aplikacji.",
            chapterOrder: 2,
            Lesson: {
              create: [
                {
                  name: "Hooki podstawowe",
                  description: "useState, useEffect, useRef.",
                  lessonOrder: 1,
                },
                {
                  name: "Context API",
                  description: "Zarządzanie stanem globalnym.",
                  lessonOrder: 2,
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
            chapterOrder: 1,
            Lesson: {
              create: [
                {
                  name: "Instalacja i uruchomienie",
                  description: "Pierwszy serwer Node.js.",
                  lessonOrder: 1,
                },
                {
                  name: "Moduły i pakiety",
                  description: "Jak korzystać z npm i importować moduły.",
                  lessonOrder: 2,
                },
              ],
            },
          },
          {
            name: "Express i REST API",
            description: "Tworzenie API i routing.",
            chapterOrder: 2,
            Lesson: {
              create: [
                {
                  name: "Tworzenie serwera Express",
                  description: "Podstawowe endpointy i middleware.",
                  lessonOrder: 1,
                },
                {
                  name: "REST API",
                  description: "Operacje GET, POST, PUT, DELETE.",
                  lessonOrder: 2,
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
