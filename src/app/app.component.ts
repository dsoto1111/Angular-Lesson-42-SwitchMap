import { Component, OnInit } from '@angular/core';
import { map, of, filter, pipe, delay, interval, switchMap } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    obs$ = of(1, 2, 3);

    ngOnInit(): void {
        this.obs$.pipe(this.operatorBundle()).subscribe({
            next: (whatever) => { console.log(whatever) },
            error: (err) => { console.log(err) },
            complete: () => { console.log('This subscription has completed') }
        });

        //this.obs$.pipe(map(value => value * 5), filter(num => num < 15)).subscribe({
        //    next: (whatever) => { console.log(whatever) },
        //    error: (err) => { console.log(err) },
        //    complete: () => { console.log('This subscription has completed') }
        //});

        const req$ = this.request('Request Data', 3000);

        req$.subscribe({
            next: (value) => { console.log(value); },
            error: (err) => { console.log(err); },
            complete: () => { console.log('The request subscription has completed') }
        })

        const stream1$ = this.stream('Stream-1', 5000);
        const stream2$ = this.stream('Stream-2', 1000);

        /*stream1$.subscribe({
            next: (value) => { console.log(value); },
            error: (err) => { console.log(err); },
            complete: () => { console.log('The stream 1 subscription has completed') }            
        })

        stream2$.subscribe({
            next: (value) => { console.log(value); },
            error: (err) => { console.log(err); },
            complete: () => { console.log('The stream 2 subscription has completed') }            
        })*/   
        
        const switchMapResult$ = stream1$.pipe(switchMap(source => {
            console.log("Source observable: " + source);
            return this.stream("Switchmap Stream: ", 1000);
        }));

        switchMapResult$.subscribe({
            next: (value) => { console.log(value); },
            error: (err) => { console.log(err); },
            complete: () => { console.log('The switchMapResult subscription has completed') }            
        })   
    }

    operatorBundle() {
        return pipe(
            map((value: number) => value * 5),
            filter(num => num < 15)
        );
    }

    request(value: any, delayTime: number) {
        return of(value).pipe(delay(delayTime));
    }

    stream(value: any, delayTime: number) {
        return interval(delayTime).pipe(map(num => value + " " + num));
    }
}
