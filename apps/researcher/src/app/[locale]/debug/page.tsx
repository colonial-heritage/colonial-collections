import {DebugButton} from './frontend';
import {Notifications} from '@colonial-collections/ui';

export default function DebugPage() {
  return (
    <div>
      <h1>Debug</h1>
      <Notifications />
      <p>Debug page</p>
      <DebugButton />
    </div>
  );
}
