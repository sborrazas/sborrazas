:title: "How to choose the right tool for the job"
:date: 2017-03-20
:slug: how-to-choose-the-right-tool
:description: How do you choose which tools to use for a given problem?
:keywords: problem,tool,programming,paradigm,complexity,declarative

Ever since I started working as the lead developer in software teams, I've been
involved in multiple discussions about **why I chose some tools over others**.
In many cases, when confronted with this question, I've found myself exposed and
with no immediate answer to provide but _"it's just obviously better"_.

After much analysis, I believe I've found the main principle I have used when
choosing a solution or tool: **choose the tool with the least power that solves
the problem**.

This is my attempt at explaining why this is important.

## Rule of Least Power

When it comes to tools, features come with a **huge** cost. This cost should be
evaluated by the programmer; this is where most programmers fail at and the
cause of most hard to maintain software. The use of state, for instance, is a
powerful feature that many languages provide which makes programs harder to
reason about; the programmer's job is to evaluate if the problem can be solved
without it, and if so, to find the right replacement tool.

It is important to note, that by _tool_ I not only mean programming paradigms,
languages or libraries, but I also mean the features they provide (which are
tools themselves). For instance, avoiding to use mutable variables does not mean
that you shouldn't use imperative languages. You can use an imperative language
and avoid using the mutable variables feature altogether. However, choosing a
language that doesn't allow you to use mutable variables by default would be
preferred if the circumstances allow it.

This gives rise to the importance of the interfaces between the different tools
and modules of your program. Separating your program into the right pieces
allows for more granularity on the tools to choose for each piece, and thus
allows to use powerful (dangerous) tools **only** on the places where they are
needed.

Hidden inside this rule, there's another not so evident but very important
conclusion that arises: declarative tools are less powerful than imperative ones
and thus preferred.

**Note:** declarativeness is not a binary property, but more like a continuous
measure. Because of this, I usually talk about a _more declarative tool_, rather
than just a _declarative tool_.

Examples of this rule being applied:

* Stateless over stateful
* Data structures over procedures
* Synchronous over asynchronous
* Strict styleguides over individual code styles
* A regular knife over a swiss-army knife (ok, too far-fetched, but still...)

Applying this rule is not always possible. For those situations I apply a
secondary rule: **encapsulating pain points**.

## Encapsulating Pain Points

If you have failed to apply the previous rule because of some reason of your own
domain (and there are many valid ones), you are now in a dangerous place: you
have too much power.

The solution is to reduce the harm of having too much power by finding,
extracting and encapsulating pain points into their own little modules, with a
simple API that restricts the spread of contamination (power).

This extraction should be done very carefully, taking the following two things
into account:

* The module in which you encapsulated it into should be as small as possible;
  too much powerful code is a recipe for disaster.
* The API exposed should also be as small as possible, hiding as much complexity
  as you can. For example, you can build a module with a declarative interface
  imperatively.

By following these two rules I usually manage to tame the dangers of complexity
when complexity can't be avoided.

Examples of _dangerous_ tools (and tool features) that need to be encapsulated:

* State (the most dangerous one)
* Concurrency, threads, asynchronous code
* Complex algorithms, that deal with performance and security
* Global access, shared memory, transactions

## Conclusion

Choosing the right tool is a very important aspect in software development. This
isn't always given the importance it needs.

Besides these rules that I consider crucial, there are other external reasons
by which your decision on which tool to use may be affected. These include
social factors, experience, timing constraints and many others. **These reasons
are completely valid** and should be considered. However, there should be a
conscious acknowledgement that these reasons are affecting the outcome
negatively in favor of having short-term results.

Other than that, stick to **Rule of Least Power**.

And that is, paradoxically, how you build powerful applications.

## Further reading

* Van Roy, Peter, and Seif Haridi. [Concepts, techniques, and models of computer
  programming](https://mitpress.mit.edu/books/concepts-techniques-and-models-computer-programming).
  The MIT Press, 2004
* Wikipedia. [Rule of least power](https://en.wikipedia.org/wiki/Rule_of_least_power)
