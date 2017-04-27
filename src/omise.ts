import { Client } from "./omise/client";
import { Button, Card, Form, Frame } from "./omise/card";
import * as legacy from "./omise/legacy";

let Omise: Client = new Client();

Omise.Card = {
  Button: Button,
  Form:   Form,
  Frame:  Frame,
};

const OmiseCardLegacy = new legacy.Card(Omise);
OmiseCardLegacy.init();

if (!window.Omise) {
  window.OmiseCard = OmiseCardLegacy;
  window.Omise = Omise;
}
