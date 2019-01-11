:title: "Pros and cons of programming in Erlang"
:date: 2019-01-11
:slug: pros-cons-programming-erlang
:description: My attempt at describing my experience with Erlang
:keywords: erlang,pros,cons,simplicity,concurrency

Erlang is a little-known programming language that has a lot of
history and tremendous capabilities for building concurrent software.

Since it's not really a popular language, many times I get asked
what's so good about Erlang and how I feel about using it for certain
types of projects. This is my attempt at answering these questions.

## Pros

### Simplicity

Personally, this is one of the most valuable characteristics of a
language. Not only is Erlang functional (one of the simplest existing
programming languages paradigm), but it also has a very small set of
syntactic primitives that you can use. Even the concurrent aspect of
the language is done using just plain functions (with the exception of
the `receive` primitive).

Erlang's simplicity also makes it very understandable and fun to work
with.

### Managing Concurrency & Failure

Erlang concurrent programs can be built, scaled and distributed with
ease. Once you have the deployment and integration set up, scaling
Erlang nodes and spawning new Erlang processes on different machines
becomes easy. Erlang standard library provides easy-to-use functions
for this very purpose, so reaching parallelism is not only cheap
in terms of implementation but also elegant.

When it comes to program failures Erlang also has your back. When
spawning new processes you are guaranteed to be notified about it to
all the monitors and links that were established. This allows to
re-spawn any failed process automatically, which is already part of
the OTP standard library and the default way for structuring Erlang
applications.

### Mature community

One of the most important aspects to consider when trying to predict a
technology's future is to check the what kind of community that
technology is being supported and used by. We've all seen good
technologies that end up being destroyed with useless and buggy
features; this is usually what a toxic community does.

Erlang's community is small, mature and simplicity-driven, which
protects it from being destroyed. This is why Erlang benefits and
robustness has lasted this long.

## Cons

### Setup

Setting up, provisioning and deploying Erlang applications can be hard
to understand and cumbersome. This is due to many reasons, one of the
most important ones being the lack of a proper and unique package
manager.

Also, the hot-reloading feature that Erlang provides by default is no
longer applicable is nowadays containerization of
applications. Instead of having to upload the new code and triggering
a hot-reload, you would just start up an new container and stop the
one that's currently running. The Docker-way of doing things differs a
bit from the Erlang-way, so in some cases, you may have to apply some
hack-ish behavior for deployments.

### Types

Erlang is a dinamically-typed language, meaning that during the
compilation phase you won't get any type errors. I've worked around
strongly-typed languages for some time and I can say that not having
the compiler type-check your programs is a huge downside. Even though
with a static type checker errors in your programs are detected during
development, Erlang's robustness and failure handling makes errors
during runtime a lot less costly.

There's also some other tools that allow to type-check your Erlang
programs during compilation, such as Dialyzer, but still lack many
features and will not detect all the errors you may have, even when
turning on all possible warnings. You might get a few errors that are
helpful, but it will still miss many errors that can be checked at
compile-time.

## Conclusion

All-in-all, Erlang does an almost-perfect job at handling concurrency
and the complexity involved when dealing with it, including error
handling, concurrency guarantees and architectures robustness. Even
though it lacks some very useful features used by many programming
languages like a proper package manager and a static type-checker, it
does not obfuscate its benefits.

Erlang might not be the right tool for every project, but it's
definitely very practical and safe working with it which makes it
worth considering it. Honestly, I love Erlang.
