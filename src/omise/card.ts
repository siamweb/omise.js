import { Button } from './card/button';
import { Form } from './card/form';
import { Frame } from './card/frame';

interface Card {
  Button: typeof Button;
  Form:   typeof Form;
  Frame:  typeof Frame;
}

export { Button, Card, Form, Frame };
