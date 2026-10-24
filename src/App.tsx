
import IconHome from '~icons/tabler/home';
import {  Router } from './router';
import './App.css';
import { Button } from '@kobalte/core/button';

export default function App() {
  return (
    <Router>
      {(props) => (
        <>
        <div class="flex items-center gap-3 p-4">
          <IconHome class="size-10 text-red-500" />
          <h1 class="text-red-500 text-6xl">How are you?</h1>
          <Button >Click me</Button>
        </div>
        </>
      )}
    </Router>
  );
}
