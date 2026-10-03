import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface Employee { id?: number; name: string; department: string; bio: string; }
interface Row extends Employee { safeBio: SafeHtml; }

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <main>
      <h1>Employee Directory</h1>

      <section class="card">
        <h2>Add employee</h2>
        <input #n placeholder="Name">
        <input #d placeholder="Department">
        <textarea #b placeholder="Biography (HTML allowed)"></textarea>
        <button (click)="add(n.value, d.value, b.value); n.value=''; d.value=''; b.value=''">Add</button>
      </section>

      <section class="card">
        <input #q placeholder="Search by name">
        <button (click)="search(q.value)">Search</button>
        <button (click)="load()">Show all</button>
      </section>

      @for (e of rows(); track e.id) {
        <article class="card">
          <h3>{{ e.name }}</h3>
          <p class="dept">{{ e.department }}</p>
          <div [innerHTML]="e.safeBio"></div>
          <button (click)="remove(e.id!)">Delete</button>
        </article>
      }
    </main>
  `,
  styles: [`
    main { max-width: 640px; margin: 2rem auto; font-family: sans-serif; }
    .card { border: 1px solid #ccc; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }
    input, textarea { display: block; width: 100%; margin-bottom: .5rem; padding: .4rem; box-sizing: border-box; }
    button { margin-right: .5rem; }
    .dept { color: #666; margin: 0 0 .5rem; }
  `],
})
export class EmployeesComponent {
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);
  private api = 'http://localhost:8080/api/employees';
  rows = signal<Row[]>([]);

  constructor() { this.load(); }

  private show(list: Employee[]) {
    this.rows.set(list.map(e => ({
      ...e,
      // VULNERABLE: switches off Angular's built-in HTML sanitizer
      safeBio: this.sanitizer.bypassSecurityTrustHtml(e.bio ?? ''),
    })));
  }

  load() {
    this.http.get<Employee[]>(this.api).subscribe(l => this.show(l));
  }

  search(name: string) {
    this.http.get<Employee[]>(this.api + '/search', { params: { name } })
      .subscribe(l => this.show(l));
  }

  add(name: string, department: string, bio: string) {
    this.http.post(this.api, { name, department, bio }).subscribe(() => this.load());
  }

  remove(id: number) {
    this.http.delete(this.api + '/' + id).subscribe(() => this.load());
  }
}
