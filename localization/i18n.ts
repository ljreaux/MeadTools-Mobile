import i18n from "i18next";
import "intl-pluralrules";
import RNLanguageDetector from "@os-team/i18next-react-native-language-detector";

import { initReactI18next } from "react-i18next";
import { ingredientTranslations } from "./ingredients";
import { homeCalcTranslations } from "./home";
import { unitsTranslations } from "./units";
import { extraCalcsTranslations } from "./extraCalcs";
import { nutrientCalcTranslations } from "./nutrientCalc";
import { navBarTranslations } from "./navbar";
import { aboutTranslations } from "./about";
import { contactTranslations } from "./contact";
import { yeastTranslations } from "./otherYeasts";
import { stabilizersTranslations } from "./stabilizersAndAdditives";
import { PDFTranslations } from "./PDF";
import { notesTranslations } from "./notes";
import { toolTipTranslations } from "./tooltips";

const [ingredientsEN, ingredientsDE] = ingredientTranslations;
const [homeCalcEN, homeCalcDE] = homeCalcTranslations;
const [unitsEN, unitsDE] = unitsTranslations;
const [ExtraCalcsEN, ExtraCalcsDE] = extraCalcsTranslations;
const [NutrientCalcEN, NutrientCalcDE] = nutrientCalcTranslations;
const [NavbarEN, NavbarDE] = navBarTranslations;
const [AboutEN, AboutDE] = aboutTranslations;
const [ContactEN, ContactDE] = contactTranslations;
const [otherYeastsEN, otherYeastsDE] = yeastTranslations;
const [stabilizersEN, stabilizersDE] = stabilizersTranslations;
const [PDFEN, PDFDE] = PDFTranslations;
const [notesEN, notesDE] = notesTranslations;
const [toolTipEN, toolTipDE] = toolTipTranslations;

i18n
  .use(RNLanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    resources: {
      en: {
        translation: {
          greeting: "Hello",
          ...ingredientsEN,
          ...homeCalcEN,
          ...unitsEN,
          ...ExtraCalcsEN,
          ...NutrientCalcEN,
          ...NavbarEN,
          ...AboutEN,
          ...ContactEN,
          ...otherYeastsEN,
          ...stabilizersEN,
          ...PDFEN,
          ...notesEN,
          ...toolTipEN,
        },
      },
      de: {
        translation: {
          greeting: "Hallo",
          ...ingredientsDE,
          ...homeCalcDE,
          ...unitsDE,
          ...ExtraCalcsDE,
          ...NutrientCalcDE,
          ...NavbarDE,
          ...AboutDE,
          ...ContactDE,
          ...otherYeastsDE,
          ...stabilizersDE,
          ...PDFDE,
          ...notesDE,
          ...toolTipDE,
        },
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
