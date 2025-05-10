'use client';

import { Link } from '../Link';
import styles from './NavBar.module.scss';

export function NavBar() {

    return <nav className={styles.nav}>
        <Link href='/zane-stats-calculator'>Zane Stats Calculator</Link>
    </nav>;
}
